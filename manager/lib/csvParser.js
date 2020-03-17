/**
 * Parse the CSV file 
 * and call the utility
 * to insert the data array in 
 * MySQL database
 */

/**
 * File system and Path utility
 */
const fs = require('fs');
const path = require('path');

/**
 * Require fast-csv module
 */
const csv = require('fast-csv');

/**
 * Require cache module
 */
const cache = require('../lib/cache');

/**
 * Require event emitter
 */
const eventEmitter = require('./eventEmitter');

/**
 * Require pool
 */
const pool = require('../rdbms/pool');

/**
 * Get connection from pool
 * and initialize transaction
 */
const initProcess = async (filename, taskID) => {

    return new Promise((resolve, reject) => {
        // Get an available connection from the pool
        pool.getConnection(function(err, connection) {
            if(err) {
                reject(err);
            }
            connection.beginTransaction(async (err) => {
                if (err) {
                    // Rollback on transaction failure
                    connection.rollback(function(err) {
                        // Reject promise
                        reject(err);
                    });
                } else {
                    // Transaction initialization complete
                    // for task
                    console.log('[TRANSACTION] Initialization Complete', taskID);

                    // Start processing CSV file
                    const res = await processCSV(connection, filename, taskID);

                    // If terminated,
                        // then update isTerminated in database
                        // rollback
                    if(res === 'terminate') {
                        console.log('ROLLBACK CODE HERE');
                    } else if(res === 'complete') {
                        console.log('COMMIT CODE HERE');
                    }

                    connection.release();

                    // If no error then commit
                }
            })

        });
    }).catch((alert) => {
        console.error('[ERROR] Coundn\' complete the process for task ->', taskID);
        console.error(alert);
    });
}

/**
 * Execute query to insert a csv row in the database
 * @param {Object} connection 
 * @param {String} taskID 
 * @param {Array} fields 
 */
const executeQuery = async (connection, taskID, fields) => {
    /**
     * Promise to handle SQL query
     * to insert a csv-row in database
     */
    return new Promise((resolve, reject) => {
        // Execute Query
        connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [taskID].concat(fields), function(err, results) {
            if (err) {
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
    }).catch((alert) => {
        console.error('[ERROR] Coundn\'t complete the query execution for task ->', taskID);
        console.error(alert);
    });
}

/**
 * Parse CSV
 * @param {Object} connection 
 * @param {String} filename 
 * @param {String} taskID 
 */
const processCSV = async (connection, filename, taskID) => {
    /**
     * Promise to handle processing of CSV
     */
    return new Promise((resolve, reject) => {
        /**
         * Couter to monitor number of rows processed
         */
        let rowCount = 0;

        /**
         * Create a readstream for CSV
         */
        const stream = fs.createReadStream(path.resolve(__dirname, '../utils/test_csv', filename))
            /**
             * Pipe
             */
            .pipe(csv.parse({ 
                headers: true 
            }))
            
            /**
             * Report Error
             */
            .on('error', (error) => {
                console.log('[TERMINATED] Parsing CSV for task ->', taskID);
                // console.log(error.message);
                resolve('terminate');
            })

            /**
             * Insert CSV row data into the database
             */
            .on('data', async (row) => {
                // Extract row fields
                let arr = Array();
                let rowID = rowCount + 1;
                rowCount += 1;
                arr.push(rowID);
                let objArr = Array(row);
                const fields = arr.concat(objArr.map(x => Object.values(x))[0]);

                // Insert row in database
                await executeQuery(connection, taskID, fields);
            })
            
            /**
             * On end of stream
             */
            .on('end', async () => {
                console.log('Parsed Rows:', rowCount, 'for task ->', taskID);
                console.log('[READ_STREAM] CSV Processing complete for task -> ', taskID);
                resolve('complete');
            })

            /**
             * On pause request
             */
            .on('pause', async () => {
                console.log('[READ_STREAM] Paused for task -> ', taskID);
                console.log('[CONNECTION] Paused for task -> ', taskID);
            });

        /**
         * Redis event listener
         */
        eventEmitter.addListener('set', async (key) => {
            // Get task that was updated
            let task = await cache.get(key);
            task = JSON.parse(task);
            
            // Check if task was terminated
            if(task.isTerminated) {
                console.log('[READ_STREAM] Destroying for task -> ', taskID);   
                // stream.destroy('terminate');
                stream.end()
            } else 
            
            // Check if tasked was paused but stream is running
            // then pause the stream and connection
            if(task.isPaused && !stream.isPaused()) {
                stream.pause();
                connection.pause();

                // automatic destroy code
                // after 5 seconds
                setTimeout(() => {
                    // stream.destroy('terminate');
                    stream.end()
                    resolve('terminate');
                }, 10000);
            } else
            // Check if tasked was supposed to be running but stream is paused
            // then resume the stream and connection
            if(!task.isPaused && stream.isPaused()) {
                stream.resume();
                connection.resume();
                console.log('[READ_STREAM] Resumed for task -> ', taskID); 
                console.log('[CONNECTION] Resumed for task -> ', taskID); 
            }
        });
    });
};

// exec('kill -TERM ' + process.pid.toString());
exports.process = initProcess;
