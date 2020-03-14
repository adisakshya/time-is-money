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
const _pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// // Query Code Snippet
// _pool.query('select * from managerdb.tasks', (err, results) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('success')
//     console.log(results);
//   }
// });

exports.pool = _pool;