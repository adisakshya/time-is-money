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
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM managerdb.tasks', (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * SELECT task by ID
 * @param {String} id 
 */
const getTaskByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * SELECT all completed tasks
 */
const getAllCompletedTasks = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isCompleted = ?', [1], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * SELECT all paused tasks
 */
const getAllPausedTasks = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isPaused = ?', [1], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * SELECT all terminated tasks
 */
const getAllTerminatedTasks = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isTerminated = ?', [1], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * INSERT new task
 * @param {String} id 
 */
const insertNewTask = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('INSERT INTO managerdb.tasks(id) values(?)', [id], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
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
 * INSERT data for running task
 * @param {String} id 
 */
const insertTaskData = async (id, fields) => {
    // pool.getConnection(function(err, connection) {
    //     connection.beginTransaction(function(err) {
    //         if (err) {                  // Transaction Error
    //             connection.rollback(function() {
    //                 connection.release();
    //             });
    //         } else {
    //             connection.query('INSERT INTO managerdb.taskData(taskID, rowID, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10, field11, field12, field13, field14, field15, field16, field17, field18, field19, field20) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id].concat(fields), function(err, results) {
    //                 if (err) {          // Query Error
    //                     connection.rollback(function() {
    //                         connection.release();
    //                     });
    //                 } else {
    //                     connection.commit(function(err) {
    //                         if (err) {
    //                             connection.rollback(function() {
    //                                 connection.release();
    //                             });
    //                         } else {
    //                             // Success
    //                             connection.release();
    //                         }
    //                     });
    //                 }
    //             });
    //         }    
    //     });
    // });
};

/**
 * DELETE a task by ID 
 * @param {String} id 
 */
const deleteTaskByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('DELETE FROM managerdb.tasks where id = ?', [id], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
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
 * DELETE all tasks
 */
const deleteAllTasks = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('DELETE FROM managerdb.tasks', function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
                                    resolve(results);
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
 * UPDATE a task as complete
 * @param {String} id 
 */
const completeTask = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isCompleted = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
                                    resolve(results);
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
 * @param {String} id 
 */
const pauseTask = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isPaused = ? WHERE TASK.id = ? and TASK.isTerminated = ? and TASK.isCompleted = ? and TASK.isPaused = ?;', [1, id, 0, 0, 0], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
                                    resolve(results);
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
 * @param {String} id 
 */
const resumeTask = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isPaused = ? WHERE TASK.id = ? and TASK.isTerminated = ? and TASK.isCompleted = ? and TASK.isPaused = ?;', [0, id, 0, 0, 1], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
                                    resolve(results);
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
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.beginTransaction(function(err) {
                if (err) {                  // Transaction Error
                    connection.rollback(function() {
                        connection.release();
                        reject(err);
                    });
                } else {
                    connection.query('UPDATE managerdb.tasks as TASK SET TASK.isTerminated = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                        if (err) {          // Query Error
                            connection.rollback(function() {
                                connection.release();
                                reject(err);
                            });
                        } else {
                            connection.commit(function(err) {
                                if (err) {
                                    connection.rollback(function() {
                                        connection.release();
                                        reject(err);
                                    });
                                } else {
                                    // Success
                                    connection.release();
                                    resolve(results);
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
 * SELECT total rows for a task
 * @param {String} id 
 */
const getTotalRows = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT totalRows FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * SELECT processed rows for a task
 * @param {String} id 
 */
const getProcessedRows = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT rowsProcessed FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


exports.getAllTasks = getAllTasks;
exports.getTaskByID = getTaskByID;
exports.getAllCompletedTasks = getAllCompletedTasks;
exports.getAllPausedTasks = getAllPausedTasks;
exports.getAllTerminatedTasks = getAllTerminatedTasks;
exports.insertNewTask = insertNewTask;
exports.insertTaskData = insertTaskData;
exports.deleteTaskByID = deleteTaskByID;
exports.deleteAllTasks = deleteAllTasks;
exports.completeTask = completeTask;
exports.pauseTask = pauseTask;
exports.resumeTask = resumeTask;
exports.terminateTask = terminateTask;
exports.getTotalRows = getTotalRows;
exports.getProcessedRows = getProcessedRows;