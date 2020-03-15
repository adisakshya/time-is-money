/**
 * Create connection pool
 * MySQL Database
 */

 /**
  * Require mysql module
  */
const mysql = require('mysql');

/**
 * Create Connection Pool
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

module.exports = pool;