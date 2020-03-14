/**
 * Model to handle Process
 */

/**
 * SELECT all rows by task ID
 * @param {String} taskID 
 */
const getAllRowsForTaskID = async (taskID) => {
  
};

/**
 * SELECT row by taskID and rowID
 * @param {String} taskID 
 * @param {String} rowID 
 */
const getRow = async (taskID, rowID) => {
  
};

/**
 * SELECT count of rows for a taskID
 * @param {String} taskID 
 */
const getRowCountByTaskID = async (taskID) => {

};

/**
 * INSERT new row
 * @param {String} taskID 
 * @param {Array} fields 
 */
const insertNewRow = async (taskID, fields) => {
    
};

/**
 * DELETE a row by taskID and rowID
 * @param {String} taskID 
 * @param {Integer} rowID 
 */
const deleteRow = async (taskID, rowID) => {
    
};


exports.getAllRowsForTaskID = getAllRowsForTaskID;
exports.getRow = getRow;
exports.getRowCountByTaskID = getRowCountByTaskID;
exports.insertNewRow = insertNewRow;
exports.deleteRow = deleteRow;