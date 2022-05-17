const mysql = require('mysql2');
require('dotenv').config();

const poolConnection = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
    password: process.env.SQL_PW,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
});

module.exports = poolConnection