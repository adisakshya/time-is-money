/**
 * Model to handle Tasks and State of a Task
 */

/**
 * Get connection pool
 */
const pool = require('../../rdbms/pool');

/**
 * SELECT all tasks
 */
const getAllTasks = async () => {
    /**
     * Promise to select all tasks
     */
    return new Promise((resolve, reject) => {
        /**
         * Execute query to get all tasks from managerdb
         */
        pool.query('SELECT * FROM managerdb.tasks', (err, results) => {
            if (err) {
                // Reject promise on error
                reject(err);
            } else {
                // Resolve promise
                resolve(results);
            }
        });
    });
};

// /**
//  * SELECT task by ID
//  * @param {String} id [Task ID]
//  */
// const getTaskByID = async (id) => {
//     /**
//      * Promise to select task by ID
//      */
//     return new Promise((resolve, reject) => {
//         /**
//          * Execute query to get task by ID
//          */
//         pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };

/**
 * SELECT all completed tasks
 */
// const getAllCompletedTasks = async () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isCompleted = ?', [1], (err, results) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };

/**
 * SELECT all paused tasks
 */
// const getAllPausedTasks = async () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isPaused = ?', [1], (err, results) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };

/**
 * SELECT all terminated tasks
 */
// const getAllTerminatedTasks = async () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isTerminated = ?', [1], (err, results) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };

/**
 * INSERT new task
 * @param {String} id [Task ID]
 */
const insertNewTask = async (id) => {
    
    /**
     * Promise to handle insertion of new task
     */
    return new Promise((resolve, reject) => {
    
        /**
         * Get connection from pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Begin transaction on connection
             */
            connection.beginTransaction(function(err) {
                if (err) {
                    // On transaction error perform rollback
                    connection.rollback(function() {
                        // Release connection
                        connection.release();

                        // Reject Promise
                        reject(err);
                    });
                } else {
                    // Successful initialization of transaction

                    /**
                     * Execute query to insert new task
                     */
                    connection.query('INSERT INTO managerdb.tasks(id) values(?)', [id], function(err, results) {
                        if (err) {
                            // On query error perform rollback
                            connection.rollback(function() {
                                // Release connection
                                connection.release();

                                // Reject promise
                                reject(err);
                            });
                        } else {
                            // Successful execution of query

                            // Commit connection
                            connection.commit(function(err) {
                                if (err) {
                                    // On commit error perform rollback
                                    connection.rollback(function() {
                                        // Release connection
                                        connection.release();

                                        // Reject promise
                                        reject(err);
                                    });
                                } else {
                                    // Success

                                    // Release connection
                                    connection.release();

                                    // Resolve promise
                                    resolve(id);
                                }
                            });
                        }
                    });
                }    
            });
        });
    });
};

/**
 * DELETE a task by ID 
 * @param {String} id [Task ID]
 */
// const deleteTaskByID = async (id) => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function(err, connection) {
//             connection.beginTransaction(function(err) {
//                 if (err) {                  // Transaction Error
//                     connection.rollback(function() {
//                         connection.release();
//                         reject(err);
//                     });
//                 } else {
//                     connection.query('DELETE FROM managerdb.tasks where id = ?', [id], function(err, results) {
//                         if (err) {          // Query Error
//                             connection.rollback(function() {
//                                 connection.release();
//                                 reject(err);
//                             });
//                         } else {
//                             connection.commit(function(err) {
//                                 if (err) {
//                                     connection.rollback(function() {
//                                         connection.release();
//                                         reject(err);
//                                     });
//                                 } else {
//                                     // Success
//                                     connection.release();
//                                     resolve(id);
//                                 }
//                             });
//                         }
//                     });
//                 }    
//             });
//         });
//     });
// };

/**
 * DELETE all tasks
 */
// const deleteAllTasks = async () => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection(function(err, connection) {
//             connection.beginTransaction(function(err) {
//                 if (err) {                  // Transaction Error
//                     connection.rollback(function() {
//                         connection.release();
//                         reject(err);
//                     });
//                 } else {
//                     connection.query('DELETE FROM managerdb.tasks', function(err, results) {
//                         if (err) {          // Query Error
//                             connection.rollback(function() {
//                                 connection.release();
//                                 reject(err);
//                             });
//                         } else {
//                             connection.commit(function(err) {
//                                 if (err) {
//                                     connection.rollback(function() {
//                                         connection.release();
//                                         reject(err);
//                                     });
//                                 } else {
//                                     // Success
//                                     connection.release();
//                                     resolve(results);
//                                 }
//                             });
//                         }
//                     });
//                 }    
//             });
//         });
//     });
// };

/**
 * UPDATE a task as complete
 * @param {String} id [Task ID]
 */
const completeTask = async (id) => {
    
    /**
     * Promise to handle update operation of a task
     */
    return new Promise((resolve, reject) => {
    
        /**
         * Get connection from pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Begin transaction on connection
             */
            connection.beginTransaction(function(err) {
                if (err) {
                    // On transaction error perform rollback
                    connection.rollback(function() {
                        // Release connection
                        connection.release();

                        // Reject Promise
                        reject(err);
                    });
                } else {
                    // Successful initialization of transaction

                    /**
                     * Execute query to update task
                     */
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isCompleted = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                        if (err) {
                            // On query error perform rollback
                            connection.rollback(function() {
                                // Release connection
                                connection.release();

                                // Reject promise
                                reject(err);
                            });
                        } else {
                            // Successful execution of query

                            // Commit connection
                            connection.commit(function(err) {
                                if (err) {
                                    // On commit error perform rollback
                                    connection.rollback(function() {
                                        // Release connection
                                        connection.release();

                                        // Reject promise
                                        reject(err);
                                    });
                                } else {
                                    // Success

                                    // Release connection
                                    connection.release();

                                    // Resolve promise
                                    resolve(id);
                                }
                            });
                        }
                    });
                }    
            });
        });
    });
};

/**
 * UPDATE a task as paused
 * @param {String} id [Task ID]
 */
const pauseTask = async (id) => {
    /**
     * Promise to handle update operation of a task
     */
    return new Promise((resolve, reject) => {
    
        /**
         * Get connection from pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Begin transaction on connection
             */
            connection.beginTransaction(function(err) {
                if (err) {
                    // On transaction error perform rollback
                    connection.rollback(function() {
                        // Release connection
                        connection.release();

                        // Reject Promise
                        reject(err);
                    });
                } else {
                    // Successful initialization of transaction

                    /**
                     * Execute query to update task
                     */
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isPaused = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                        if (err) {
                            // On query error perform rollback
                            connection.rollback(function() {
                                // Release connection
                                connection.release();

                                // Reject promise
                                reject(err);
                            });
                        } else {
                            // Successful execution of query

                            // Commit connection
                            connection.commit(function(err) {
                                if (err) {
                                    // On commit error perform rollback
                                    connection.rollback(function() {
                                        // Release connection
                                        connection.release();

                                        // Reject promise
                                        reject(err);
                                    });
                                } else {
                                    // Success

                                    // Release connection
                                    connection.release();

                                    // Resolve promise
                                    resolve(id);
                                }
                            });
                        }
                    });
                }    
            });
        });
    });
};

/**
 * UPDATE a task as resumed
 * @param {String} id [Task ID]
 */
const resumeTask = async (id) => {
    /**
     * Promise to handle update operation of a task
     */
    return new Promise((resolve, reject) => {
    
        /**
         * Get connection from pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Begin transaction on connection
             */
            connection.beginTransaction(function(err) {
                if (err) {
                    // On transaction error perform rollback
                    connection.rollback(function() {
                        // Release connection
                        connection.release();

                        // Reject Promise
                        reject(err);
                    });
                } else {
                    // Successful initialization of transaction

                    /**
                     * 
                     */
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isPaused = ? WHERE TASK.id = ?;', [0, id], function(err, results) {
                        if (err) {
                            // On query error perform rollback
                            connection.rollback(function() {
                                // Release connection
                                connection.release();

                                // Reject promise
                                reject(err);
                            });
                        } else {
                            // Successful execution of query

                            // Commit connection
                            connection.commit(function(err) {
                                if (err) {
                                    // On commit error perform rollback
                                    connection.rollback(function() {
                                        // Release connection
                                        connection.release();

                                        // Reject promise
                                        reject(err);
                                    });
                                } else {
                                    // Success

                                    // Release connection
                                    connection.release();

                                    // Resolve promise
                                    resolve(id);
                                }
                            });
                        }
                    });
                }    
            });
        });
    });
};

/**
 * UPDATE a task as terminated
 * @param {String} id 
 */
const terminateTask = async (id) => {
    /**
     * Promise to handle update operation of a task
     */
    return new Promise((resolve, reject) => {
    
        /**
         * Get connection from pool
         */
        pool.getConnection(function(err, connection) {

            /**
             * Begin transaction on connection
             */
            connection.beginTransaction(function(err) {
                if (err) {
                    // On transaction error perform rollback
                    connection.rollback(function() {
                        // Release connection
                        connection.release();

                        // Reject Promise
                        reject(err);
                    });
                } else {
                    // Successful initialization of transaction

                    /**
                     * 
                     */
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isTerminated = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                        if (err) {
                            // On query error perform rollback
                            connection.rollback(function() {
                                // Release connection
                                connection.release();

                                // Reject promise
                                reject(err);
                            });
                        } else {
                            // Successful execution of query

                            // Commit connection
                            connection.commit(function(err) {
                                if (err) {
                                    // On commit error perform rollback
                                    connection.rollback(function() {
                                        // Release connection
                                        connection.release();

                                        // Reject promise
                                        reject(err);
                                    });
                                } else {
                                    // Success

                                    // Release connection
                                    connection.release();

                                    // Resolve promise
                                    resolve(id);
                                }
                            });
                        }
                    });
                }    
            });
        });
    });
};


exports.getAllTasks = getAllTasks;
// exports.getTaskByID = getTaskByID;
// exports.getAllCompletedTasks = getAllCompletedTasks;
// exports.getAllPausedTasks = getAllPausedTasks;
// exports.getAllTerminatedTasks = getAllTerminatedTasks;
exports.insertNewTask = insertNewTask;
// exports.insertTaskData = insertTaskData;
// exports.deleteTaskByID = deleteTaskByID;
// exports.deleteAllTasks = deleteAllTasks;
exports.completeTask = completeTask;
exports.pauseTask = pauseTask;
exports.resumeTask = resumeTask;
exports.terminateTask = terminateTask;