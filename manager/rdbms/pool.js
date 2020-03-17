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
  host: process.env.MYSQL_HOST,           // Host
  user: process.env.MYSQL_USER,           // Username
  password: process.env.MYSQL_PASSWORD,   // Password
  database: process.env.MYSQL_DATABASE,   // Database name
});

/**
 * Export connection pool
 */
module.exports = pool;