const { get } = require('express/lib/response');
let conn = require('./db')

class Pagination {

    constructor(
        query,
        params = [],
        itensPerPage = 10) {

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;
    }

    getPage(page) {

        this.currentPage = page - 1;

        this.params.push(
            this.currentPage * this.itensPerPage,
            this.itensPerPage
        )
        return new Promise((resolve, reject) => {
            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {
                if (err) {
                    reject(err)
                } else {

                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);
                    this.currentPage++;

                    resolve(this.data);
                }
            })
        })
    }

    getTotal() {
        return this.total;
    }
    getCurrentPage() {
        return this.currentPage;
    }
    getTotalPages() {
        return this.totalPages;
    }
    getNavigation(params) {

        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0;
        let nrend = 0;

        if (this.getTotalPages() < limitPagesNav) {
            limitPagesNav = this.getTotalPages();
        }

        //Se estamos nas primeiras páginas
        if ((this.getCurrentPage() - parseInt(limitPagesNav / 2)) < 1) {

            nrstart = 1;
            nrend = limitPagesNav;

        }
        //Estamos chegando nas últimas páginas
        else if ((this.getCurrentPage() + parseInt(limitPagesNav / 1)) > this.getTotalPages()) {
            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages();
        }
        //No meio dentre as páginas
        else {
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav / 2);
        }

        for (let x = nrstart; x <= nrend; x++) {

            links.push({
                text: x,
                href: `?page=${x}`,
                active: (x === this.getCurrentPage())
            });
        }
        return links;
    }
}

module.exports = Pagination;