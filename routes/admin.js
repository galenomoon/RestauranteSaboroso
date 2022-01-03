var express = require('express');
var users = require('./../inc/users');
var router = express.Router();
var admin = require('./../inc/admin');


//Será criado um MIDDLEWARE que ficará responsável por assegurar de que todas as portas (ou rotas) ficaram seguras e só poderam ser acessadas se o usuário estiver logado
//esse recurso reforça a segurança, além de evitar a requisição manual da autenticação em cada página, ela é um recurso que funciona antes do carregar da página
router.use(function(req, res, next) {

    if (['/login'].indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login')
    } else {
        next(); //vá ao próximo middleware ou vá para a proxima rota
    }
})

router.use(function(req, res, next) {

    req.menus = admin.getMenus(req);
    next();
})


router.get('/logout', function(req, res, next) {

    delete req.session.user;
    res.redirect('admin/login')

});

router.get('/', function(req, res, next) {

    res.render('admin/index', admin.getParams(req))
});

router.post('/login', function(req, res, next) {

    if (!req.body.email) {
        users.render(req, res, "Preencha o campo de e-mail");
    } else if (!req.body.password) {
        users.render(req, res, "Preencha o campo de senha");
    } else {
        users.login(req.body.email, req.body.password).then(user => {

            req.session.user = user; //Guarda o objeto user na sessão
            res.redirect('/admin');

        }).catch(err => {
            users.render(req, res, err.message || err);
        })
    }

});
router.get('/login', function(req, res, next) {

    users.render(req, res, null)
});


router.get('/contacts', function(req, res, next) {

    res.render('admin/contacts', admin.getParams(req))
});

router.get('/emails', function(req, res, next) {

    res.render('admin/emails', admin.getParams(req))
});
router.get('/menus', function(req, res, next) {

    res.render('admin/menus', admin.getParams(req))
});
router.get('/reservations', function(req, res, next) {

    res.render('admin/reservations', admin.getParams(req, {
        date: {}
    }))
});
router.get('/users', function(req, res, next) {

    res.render('admin/users', admin.getParams(req))
});


module.exports = router;