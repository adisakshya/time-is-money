/**
 * Model to handle Tasks and State of a Task
 */

/**
 * SELECT all tasks
 */
const getAllTasks = async () => {
  
};

/**
 * SELECT task by ID
 * @param {String} id 
 */
const getTaskByID = async (id) => {
  
};

/**
 * SELECT all completed tasks
 */
const getAllCompletedTasks = async () => {

};

/**
 * SELECT all paused tasks
 */
const getAllPausedTasks = async () => {
  
};

/**
 * SELECT all terminated tasks
 */
const getAllTerminatedTasks = async () => {
  
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
    
};

/**
 * DELETE all tasks
 */
const deleteAllTasks = async () => {
  
};

/**
 * UPDATE a task as complete
 * @param {String} id 
 */
const completeTask = async (id) => {
  
};

/**
 * UPDATE a task as paused
 * @param {String} id 
 */
const pauseTask = async (id) => {
  
};

/**
 * UPDATE a task as terminated
 * @param {String} id 
 */
const terminateTask = async (id) => {
  
};

/**
 * SELECT total rows for a task
 * @param {String} id 
 */
const getTotalRows = async (id) => {
  
};

/**
 * SELECT processed rows for a task
 * @param {String} id 
 */
const getProcessedRows = async (id) => {
  
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