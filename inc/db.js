const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'User',
    database: 'saboroso',
    password: '@mySQL52931872908',
    multipleStatements: true
});
module.exports = connection;