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
    return new Promise(async (resolve, reject) => {
        let connectionIsPaused = false;

        /**
         * Redis event listener
         */
        eventEmitter.addListener('set', async (key, value) => {
            if(key !== taskID) {
                return;
            }

            // Get task that was updated
            let task = JSON.parse(value);
            if(task.isTerminated) {
                console.log('[TERMINATING] Task ->', taskID);
                resolve('terminate');
            } else if(task.isPaused && !connectionIsPaused) {
                console.log('[PAUSE] Task ->', key);
                await connection.pause();
                connectionIsPaused = true;
                console.log('[TERMINATING] Task in 15 seconds, if not resumed...');
                setTimeout(async () => {
                    let task = await cache.get(key);
                    task = JSON.parse(task);
                    if(!task.isPaused) {
                        console.log('[RESUMEING] Task ->', key);
                        await connection.resume();
                        connectionIsPaused = false;
                    } else {
                        console.log('[TERMINATING] Task ->', key);
                        resolve('terminate');
                    }
                }, 15000);
            } 
        });

        /**
         * Check task executable condition
         */
        let task = await cache.get(taskID);
        eventEmitter.emit('set', taskID, task);

        /**
         * Execute Query
         */
        connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values ?', [csvData], function(err, results) {
            if (err) {
                console.log('Error', err);
                // Rollback changes on query failure
                connection.rollback(function(err) {
                    // Reject promise
                    reject(err);
                });
            } else {
                // Resolve promise
                // on successful insertion
                resolve('complete');
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
                    console.log('[TRANSACTION] Started Task ->', taskID);

                    let res = await executeQuery(connection, taskID, dataArray);
                    if(res === 'terminate') {
                        console.log('[ROLLBACK] Task ->', taskID);
                        // Rollback on transaction failure
                        connection.rollback(function(err) {
                            // Reject promise
                            reject(err);
                        });
                    } else if(res === 'complete') {
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
                                
                                console.log('[CONNECTION] Commited Task ->', taskID);

                                // Release connection
                                connection.release();
                            }
                        });
                    }
                }    
            });    
        });
    }).catch((err) => {console.log('Error:', err);});
};

exports.saveToMySQL = saveToMySQL;