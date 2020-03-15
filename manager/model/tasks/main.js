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
    pool.query('SELECT * FROM managerdb.tasks', (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * SELECT task by ID
 * @param {String} id 
 */
const getTaskByID = async (id) => {
    pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * SELECT all completed tasks
 */
const getAllCompletedTasks = async () => {
    pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isCompleted = ?', [1], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * SELECT all paused tasks
 */
const getAllPausedTasks = async () => {
    pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isPaused = ?', [1], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * SELECT all terminated tasks
 */
const getAllTerminatedTasks = async () => {
    pool.query('SELECT * FROM managerdb.tasks as TASK where TASK.isTerminated = ?', [1], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * INSERT new task
 * @param {String} id 
 */
const insertNewTask = async (id) => {
    
};

/**
 * DELETE a task by ID 
 * @param {String} id 
 */
const deleteTaskByID = async (id) => {
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  // Transaction Error
                connection.rollback(function() {
                    connection.release();
                });
            } else {
                connection.query('DELETE FROM managerdb.tasks where id = ?', [id], function(err, results) {
                    if (err) {          // Query Error
                        connection.rollback(function() {
                            connection.release();
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                });
                            } else {
                                // Success
                                connection.release();
                            }
                        });
                    }
                });
            }    
        });
    });
};

/**
 * DELETE all tasks
 */
const deleteAllTasks = async () => {
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  // Transaction Error
                connection.rollback(function() {
                    connection.release();
                });
            } else {
                connection.query('DELETE FROM managerdb.tasks', function(err, results) {
                    if (err) {          // Query Error
                        connection.rollback(function() {
                            connection.release();
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                });
                            } else {
                                // Success
                                connection.release();
                            }
                        });
                    }
                });
            }    
        });
    });
};

/**
 * UPDATE a task as complete
 * @param {String} id 
 */
const completeTask = async (id) => {
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  // Transaction Error
                connection.rollback(function() {
                    connection.release();
                });
            } else {
                connection.query('UPDATE managerdb.tasks as TASK SET TASK.isCompleted = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                    if (err) {          // Query Error
                        connection.rollback(function() {
                            connection.release();
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                });
                            } else {
                                // Success
                                connection.release();
                            }
                        });
                    }
                });
            }    
        });
    });
};

/**
 * UPDATE a task as paused
 * @param {String} id 
 */
const pauseTask = async (id) => {
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  // Transaction Error
                connection.rollback(function() {
                    connection.release();
                });
            } else {
                connection.query('UPDATE managerdb.tasks as TASK SET TASK.isPaused = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                    if (err) {          // Query Error
                        connection.rollback(function() {
                            connection.release();
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                });
                            } else {
                                // Success
                                connection.release();
                            }
                        });
                    }
                });
            }    
        });
    });
};

/**
 * UPDATE a task as terminated
 * @param {String} id 
 */
const terminateTask = async (id) => {
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  // Transaction Error
                connection.rollback(function() {
                    connection.release();
                });
            } else {
                connection.query('UPDATE managerdb.tasks as TASK SET TASK.isTerminated = ? WHERE TASK.id = ?;', [1, id], function(err, results) {
                    if (err) {          // Query Error
                        connection.rollback(function() {
                            connection.release();
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                });
                            } else {
                                // Success
                                connection.release();
                            }
                        });
                    }
                });
            }    
        });
    });
};

/**
 * SELECT total rows for a task
 * @param {String} id 
 */
const getTotalRows = async (id) => {
    pool.query('SELECT totalRows FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};

/**
 * SELECT processed rows for a task
 * @param {String} id 
 */
const getProcessedRows = async (id) => {
    pool.query('SELECT rowsProcessed FROM managerdb.tasks as TASK where TASK.id = ?', [id], (err, results) => {
        if (err) {
          return err;
        } else {
          return results;
        }
    });
};


exports.getAllTasks = getAllTasks;
exports.getTaskByID = getTaskByID;
exports.getAllCompletedTasks = getAllCompletedTasks;
exports.getAllPausedTasks = getAllPausedTasks;
exports.getAllTerminatedTasks = getAllTerminatedTasks;
exports.insertNewTask = insertNewTask;
exports.deleteTaskByID = deleteTaskByID;
exports.deleteAllTasks = deleteAllTasks;
exports.completeTask = completeTask;
exports.pauseTask = pauseTask;
exports.terminateTask = terminateTask;
exports.getTotalRows = getTotalRows;
exports.getProcessedRows = getProcessedRows;