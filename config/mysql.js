const { promisify } = require('util');
const mysql = require('mysql');
const chalk = require('chalk')

const mysql_credential = {
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    multipleStatements: true
}

const pool = mysql.createPool(mysql_credential);


pool.getConnection((err, connection) => {
    if (err) {
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error(chalk.red('DATABASE CONNECTION WAS CLOSED'))
        }
        else if (err.code == 'ER_CON_COUNT_ERROR') {
            console.error(chalk.red('DATABASE HAS TO MANY CONNECTIOS'))
        }
        else if (err.code == 'ECONNREFUSED') {
            console.error(chalk.red('DATABASE CONNECTION WAS REFUSED'))
        }
    }
    else{
        if (connection)
            connection.release();
        console.log(chalk.green('Connected to MySQL'));
    }
    
    return;
});

//async/await instead of callback
pool.query = promisify(pool.query).bind(pool)


//export db connection pool 
module.exports = {
    pool,
    mysql_credential
}









