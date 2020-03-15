/**
 * Controller
 */

/**
 * Require UUID Module
 */
const uuid = require('uuid');

/**
 * Require processHandler
 */
const processHandler = require('../../lib/processHandler');

/**
 * Require task model 
 */
const taskModel = require('../../model/tasks/main');

/**
 * GET all tasks
 * @param {Object} req 
 * @param {Object} res 
 */
const getTasks = async (req, res) => {
    try {
        // GET all tasks
        let tasks = await taskModel.getAllTasks();

        // Return response
        return res
            .status(200)
            .json({
                "message": tasks
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "message": error.message
            });
    }
}

/**
 * GET task by ID
 * @param {Object} req 
 * @param {Object} res 
 */
const getTaskByID = async (req, res) => {
    try {
        // GET task id from params
        const taskID = req.query.id;

        // Check if taskID was provided
        if(!taskID) {
            return res
                .status(400)
                .json({
                    "message": "Missing parameter Task ID"
                });
        }
        // GET task details by ID
        let task = await taskModel.getTaskByID(taskID);

        // Return response
        return res
            .status(200)
            .json({
                "message": task
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "message": error.message
            });
    }
}

/**
 * CREATE new long running task
 * @param {Object} req 
 * @param {Object} res 
 */
const createNewTask = async (req, res) => {
    try {
        // Generate taskID
        let taskID = uuid.v4();

        // Create new task
        let result = await taskModel.insertNewTask(taskID);

        // Return response
        return res
            .status(200)
            .json({
                "message": result
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "message": error.message
            });
    }
}

/**
 * PAUSE a long running task
 * @param {Object} req 
 * @param {Object} res 
 */
const pauseTaskByID = async (req, res) => {
    try {
        // Get taskID
        const taskID = req.query.id;

        // Check if taskID was provided
        if(!taskID) {
            return res
                .status(400)
                .json({
                    "message": "Missing parameter Task ID"
                });
        }

        // Pause a task
        let result = await taskModel.pauseTask(taskID);

        // Return response
        return res
            .status(200)
            .json({
                "message": result
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "message": error.message
            });
    }
}

/**
 * RESUME a long running task
 * @param {Object} req 
 * @param {Object} res 
 */
const resumeTaskByID = async (req, res) => {
    try {
        // Get taskID
        const taskID = req.query.id;

        // Check if taskID was provided
        if(!taskID) {
            return res
                .status(400)
                .json({
                    "message": "Missing parameter Task ID"
                });
        }

        // Resume a task
        let result = await taskModel.resumeTask(taskID);

        // Return response
        return res
            .status(200)
            .json({
                "message": result
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "message": error.message
            });
    }
}

exports.getTasks = getTasks;
exports.getTaskByID = getTaskByID;
exports.createNewTask = createNewTask;
exports.pauseTaskByID = pauseTaskByID;
exports.resumeTaskByID = resumeTaskByID;

// exports.uploadRequestHandler = _uploadRequestHandler;
// /**
//  * Process uplaoded CSV
//  * @param {object} req 
//  * @param {object} res 
//  */
// const _uploadRequestHandler = async (req, res) => {
//     try {
//         // GET test csv file name
//         const csvFileName = req.query.csv;

//         // Start processing test CSV file
//         processHandler.processCSV(csvFileName);

//         return res
//             .status(200)
//             .json({
//                 "message": "Your request has been submitted"
//             });
//     } catch(error) {
//         return res
//             .status(500)
//             .json({
//                 "message": error
//             });
//     }
// }