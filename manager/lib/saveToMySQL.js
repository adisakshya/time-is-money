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
 * Require model
 */
const taskModel = require('../model/tasks/main');

/**
 * Execute query to insert a csv row in the database
 * @param {Object} connection [MySQL connection object]
 * @param {String} taskID     [Task ID]
 * @param {Array} fields      [Array of CSV fields and corresponing taskID and rowID]
 */
const executeQuery = async (connection, taskID, csvData) => {
    /**
     * Promise to handle SQL query
     * to insert a csv-row in database
     */
    return new Promise(async (resolve, reject) => {

        /**
         * Flag (boolean) variable to hold
         * pause state of the connection,
         * defaults to false -> connection is not paused initially
         */
        let connectionIsPaused = false;

        /**
         * Redis event listener
         * Used to perform pause/resume/terminate operation
         * This event listener gets triggered on every SET opertion on cache
         * and accepts the updated (KEY, VALUE) pair as arguments
         * for processing
         * 
         * Here, KEY represents the taskID
         * and VALUE represents the state (stateString) of the task
         */
        eventEmitter.addListener('set', async (key, value) => {
            
            /**
             * Check if SET operation is performed on task
             * that holds the database connection
             */
            if(key !== taskID) {
                // If not then return
                return;
            }

            // Parse the string (VALUE) to get the JSON object
            // corresponding to the task state
            let task = JSON.parse(value);

            // Check if task was updated to terminated
            if(task.isTerminated && !task.isPaused) {
                // Yes
                console.log('[STARTING TERMINATING] Task');
                
                // Resolve promise to terminate the task
                resolve('terminate');
            } else if(task.isPaused && !connectionIsPaused) {
                // If task was updated to be paused
                // but the connection is still active
                // then pause the task
                console.log('[PAUSE] Task');

                // Pause connection
                await connection.pause();

                // Update flag variable
                connectionIsPaused = true;

                // Log alert message on task pause
                // NOTE: A task will be terminated in 15 seconds,
                //       if not resumed explicitly by the user request,
                //       A task cannot be allowed to wait till inifinity,
                //       and keep holding the connection.
                console.log('[TERMINATING] Task in 15 seconds, if not resumed...');

                // Wait for 15 seconds
                setTimeout(async () => {
                    // After 15 seconds

                    // Get task current state from cache
                    let task = await cache.get(key);
            
                    // Parse the string (VALUE) to get the JSON object
                    // corresponding to the task state
                    task = JSON.parse(task);
                    
                    // Check is the task was resumed
                    // task.isResumed = ~task.isPaused
                    if(!task.isPaused && !task.isTerminated) {
                        // Resume Task
                        console.log('[RESUMEING] Task');
                        
                        // Resume connection
                        await connection.resume();

                        // Update flag variable
                        connectionIsPaused = false;
                    } else {
                        // Task was not resumed within 15 seconds
                        // then terminate the task
                        console.log('[TERMINATING] On pause timeout');

                        // Resume connection
                        await connection.resume();
                        
                        // Resolve promise to terminate task
                        resolve('terminate');
                    }
                }, 15000); // 15 seconds
            } 
        });

        /**
         * Get task current (initial) state
         * NOTE: Before executing the insert operation on the database,
         *       there is a need to check task state,
         *       if the user has paused/terminated the task, 
         *       in the time corresponding CSV was being parsed
         */
        let task = await cache.get(taskID);
        
        /**
         * Mock a SET event
         * with initial state of task,
         * this handles the situation when the task is paused/terminated
         * while corresponding CSV was being parsed
         */
        eventEmitter.emit('set', taskID, task);

        /**
         * Execute Query
         * to insert CSV information in the database
         */
        connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values ?', [csvData], function(err, results) {
            if (err) {
                // Query failes
                console.log('Error', err);
                
                // Rollback changes on query failure
                connection.rollback(function(err) {
                    // Release connection
                    connection.release();
                                    
                    // Reject promise
                    reject(err);
                });
            } else {
                // Resolve promise
                // on successful completion of
                // insertion process
                resolve('complete');
            }
        });
    }).catch((alert) => {
        // Report rejection reason
        console.log('Error:', alert);
        // and kill process
        process.kill(process.pid, 'SIGTERM');
    });
};

/**
 * Execute query to set isTerminated flag for a task
 * @param {Object} connection [MySQL connection object]
 * @param {String} taskID     [Task ID]
 * @param {Array} fields      [Array of CSV fields and corresponing taskID and rowID]
 */
const executeTerminateQuery = async (connection, taskID) => {
    
    /**
     * Promise to handle SQL query
     * to set isTerminated flag for a task
     */
    return new Promise(async (resolve, reject) => {

        /**
         * Execute Query
         * to set isTerminated flag for the task
         * in the database
         */
        connection.query('UPDATE managerdb.tasks as TASK SET TASK.isTerminated = ? WHERE TASK.id = ?;', [1, taskID], function(err, results) {
            if (err) {
                // Query failes
                console.log('Error Terminating Task ->', taskID);
                
                // Rollback changes on query failure
                connection.rollback(function(err) {
                    // Release connection
                    connection.release();
                                    
                    // Reject promise
                    reject(err);
                });
            } else {
                resolve(taskID);
            }
        });
    }).catch((alert) => {
        // Report rejection reason
        console.log('Error:', alert);
        // and kill process
        process.kill(process.pid, 'SIGTERM');
    });
};

/**
 * Process CSV dataArray 
 * and insert every row in database
 * @param {Array} dataArray [Data array containing csv data]
 * @param {String} taskID [Task ID]
 */
const saveToMySQL = async (dataArray, taskID) => {

    /**
     * Promise to handle insertion of all rows in a CSV
     * to the database
     */
    return new Promise((resolve, reject) => {

        /**
         * Get an available connection from the pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Start transaction
             */
            connection.beginTransaction(async function(err) {

                if (err) {
                    // perform rollback on transaction failure
                    connection.rollback(function(err) {
                        // Release connection
                        connection.release();
                                    
                        // Reject promise
                        reject(err);
                    });
                } else {
                    // Initialization of transaction complete
                    console.log('[TRANSACTION] Started');

                    // Execute query to insert CSV information in the database
                    let res = await executeQuery(connection, taskID, dataArray);

                    // If task was terminated
                    if(res === 'terminate') {
                        let termination = await executeTerminateQuery(connection, taskID);
                        if(termination === taskID) {
                            // Perform rollback
                            console.log('[ROLLBACK]');
                            connection.rollback(function(err) {
                                // Release connection
                                connection.release();
                                    
                                // Reject promise
                                reject(err);
                            });
                        }
                    } else if(res === 'complete') {
                        // Update cached state of the task
                        // Get task current state from cache
                        let task = await cache.get(taskID);
                
                        // Parse the string (VALUE) to get the JSON object
                        // corresponding to the task state
                        task = JSON.parse(task);

                        // Set isCompleted flag to true (1)
                        task.isCompleted = 1;
                        task.isPaused = 0;
                        task.isTerminated = 0;

                        // Update the cached state of the task
                        let updatedTask = await cache.set(taskID, JSON.stringify(task));

                        /**
                         * Execute Query
                         * to set isCOmpleted flag for the task
                         * in the database
                         */
                        connection.query('UPDATE managerdb.tasks as TASK SET TASK.isCompleted = ? WHERE TASK.id = ?;', [1, taskID], function(err, results) {
                            if (err) {
                                // Query failes
                                console.log('Error Terminating Task');
                                console.log(err);
                                
                                // Rollback changes on query failure
                                connection.rollback(function(err) {
                                    // Release connection
                                    connection.release();
                                    
                                    // Reject promise
                                    reject(err);
                                });
                            }
                        });
                        
                        // After processing complete dataArray
                        // Commit the connection
                        connection.commit(async function(err) {
                            if (err) {
                                // Rollback on commit failure
                                connection.rollback(function(err) {
                                    // Release connection
                                    connection.release();

                                    // Reject promise
                                    reject(err);
                                });
                            } else {
                                // Successful commit
                                
                                // Release connection
                                connection.release();    
                                
                                console.log('[CONNECTION] Commited');
                            }
                        });
                    }
                    
                    // Remove event listeners
                    eventEmitter.removeAllListeners();

                    resolve();
                }    
            });    
        });
    // Catch error rejected by promise
    }).catch((alert) => {
        // Report rejection reason
        console.log('Error:', alert);
        // and kill process
        process.kill(process.pid, 'SIGTERM');
    });
};

exports.saveToMySQL = saveToMySQL;