/**
 * Database Handler
 * Save CSV Data Array into MySQL database
 */

/**
 * Require cache utility
 */
const cache = require('./cache');

/**
 * Require event emitter
 */
const eventEmitter = require('./eventEmitter');

/**
 * Require connection pool
 */
const pool = require('../rdbms/pool');

/**
 * Execute query to insert a csv row in the database
 * @param {Object} connection 
 * @param {String} taskID 
 * @param {Array} fields 
 */
const executeQuery = async (connection, taskID, csvData) => {
    /**
     * Promise to handle SQL query
     * to insert a csv-row in database
     */
    return new Promise((resolve, reject) => {
        let connectionIsPaused = false;

        // Execute Query
        connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values ?', [csvData], function(err, results) {
            if (err) {
                console.log('Error', error);
                // Rollback changes on query failure
                connection.rollback(function(err) {
                    // Reject promise
                    reject(err);
                });
            } else {
                // Resolve promise
                // on successful insertion
                resolve('Row inserted');
            }
        });

        /**
         * Redis event listener
         */
        eventEmitter.addListener('set', async (key) => {
            // Get task that was updated
            let task = await cache.get(key);
            task = JSON.parse(task);
            if(task.isTerminated) {
                resolve('terminate');
            } else if(task.isPaused && !connectionIsPaused) {
                console.log('[PAUSED] Task ->', key);
                await connection.pause();
                console.log('[TERMINATING] Task in 10 seconds...');
                setTimeout(()=>{
                    console.log('[TERMINATING] Task ->', key);
                    resolve('terminate');
                }, 10000);
            } else if(!task.isPaused && connectionIsPaused) {
                console.log('[RESUME] Task ->', key);
                await connection.resume();
            }
        });
    });
}

/**
 * Process CSV dataArray 
 * and insert every row in database
 * @param {Array} dataArray 
 * @param {String} taskID 
 */
const saveToMySQL = async (dataArray, taskID) => {

    /**
     * Promise to handle insertion of all rows in a CSV
     * to the database
     */
    return new Promise((resolve, reject) => {

        // Get an available connection from the pool
        pool.getConnection(function(err, connection) {

            // Start transaction
            connection.beginTransaction(async function(err) {

                if (err) {
                    // Rollback on transaction failure
                    connection.rollback(function(err) {
                        // Reject promise
                        reject(err);
                    });
                } else {
                    // Start insertion of rows in database
                    console.log('[TRANSACTION] Started');

                    let res = await executeQuery(connection, taskID, dataArray);
                    if(res === 'terminate') {
                        console.log('[ROLLBACK] Task ->', taskID);
                        // Rollback on transaction failure
                        connection.rollback(function(err) {
                            // Reject promise
                            reject(err);
                        });
                    } else if(typeof(res) === typeof(connection)) {
                        // After processing complete dataArray
                        // Commit the connection
                        connection.commit(async function(err) {
                            if (err) {
                                // Rollback on commit failure
                                connection.rollback(function(err) {
                                    reject(err);
                                });
                            } else {
                                // Success
                                
                                console.log('[CONNECTION] Commited');

                                // Release connection
                                connection.release();
                            }
                        });
                    }
                }    
            });    
        });
    });
};

exports.saveToMySQL = saveToMySQL;