/**
 * Database Handler
 * Save CSV Data Array into MySQL database
 */

/**
 * Require cache utility
 */
const cache = require('./cache');

/**
 * Require connection pool
 */
const pool = require('../rdbms/pool');

const executeQuery = async (connection, taskID, fields) => {
    return new Promise((resolve, reject) => {
        // Execute Query
        connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [taskID].concat(fields), function(err, results) {
            if (err) {
                connection.rollback(function() {
                    connection.release();
                    reject(err);
                });
            } else {
                console.log('Inserted csv row in database for taskID ' + taskID);
                resolve();
            }
        });
    });
}

/**
 * Insert Data Array fields into MySQL database
 */
const _saveToMySQL = async (dataArray, taskID) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async function(err, connection) {
            // Start transaction
            connection.beginTransaction(async function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {

                    console.log('Transaction Started for taskID ' + taskID);

                    for(let i=0; i<dataArray.length; i++) {

                        let task = await cache.get(taskID);
                        task = JSON.parse(task);

                        // Check if task was terminated
                        if(task.isTerminated) {
                            connection.rollback(function() {
                                connection.release();
                                reject('Transaction Terminated');
                            });
                        } else if(task.isCompleted) {
                            connection.release();
                            reject('Transaction is complete');
                        } else if(task.isPaused) {
                            console.log('task was paused');
                            reject('Transaction Paused');
                        }

                        // Extract Fields
                        let arr = Array();
                        let rowID = i;
                        arr.push(rowID);
                        let objArr = Array(dataArray[i]);
                        const fields = arr.concat(objArr.map(x => Object.values(x))[0]);
                        
                        // Execute Query
                        await executeQuery(connection, taskID, fields);
                    }

                    // After processing complete dataArray
                    // Commit the connection
                    connection.commit(async function(err) {
                        if (err) {
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            // Success
                            connection.release();
                            // Update Cache
                            let task = await cache.get(taskID);
                            task = JSON.parse(task);
                            task.isCompleted = 1;
                            let updatedTask = await cache.set(taskID, JSON.stringify(task));

                            // Reolve promise
                            console.log('Transaction Complete for taskID ' + taskID);
                            resolve();
                        }
                    });

                }    
            });
        });
    });
};

exports.saveToMySQL = _saveToMySQL;