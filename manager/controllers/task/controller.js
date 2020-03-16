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
 * Require cache  utility
 */
const cache = require('../../lib/cache');

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
                "success": true,
                "message": null,
                "data": tasks,
                "error": false
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
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
                    "success": false,
                    "message": "Missing parameter Task ID",
                    "data": null,
                    "error": true
                });
        }

        // GET task details from cache
        let task = await cache.get(taskID);
        if(task) {
            // Return response
            return res
            .status(200)
            .json({
                "success": true,
                "message": "Task Found",
                "data": JSON.parse(task),
                "error": false
            });
        }
        
        // Return response
        return res
            .status(400)
            .json({
                "success": false,
                "message": "Task Not Found",
                "data": null,
                "error": true
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
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

        // Insert task details in cache
        let task = await cache.set(taskID, JSON.stringify({
            'isPaused': 0,
            'isCompleted': 0,
            'isTerminated': 0,
            'totalRows': 0,
            'processedRows': 0
        }));

        // Start CSV parsing process
        processHandler.processHandler('largeTestCSV.csv', taskID);

        // Return response
        return res
            .status(200)
            .json({
                "success": true,
                "message": "New Task Created",
                "data": result,
                "error": false
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
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
                    "success": false,
                    "message": "Missing parameter Task ID",
                    "data": null,
                    "error": true
                });
        }

        // Update Cache
        let task = await cache.get(taskID);
        task = JSON.parse(task);
        if(task && !task.isTerminated && !task.isCompleted) {
            task.isPaused = 1;
            let updatedTask = await cache.set(taskID, JSON.stringify(task));
            console.log('Pause flag set for taskID ->', taskID);
        } else if(task && (task.isCompleted || task.isTerminated)){
            // Return cannot terminate already completed/terminated task
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Cannot pause already completed/terminated task",
                    "data": taskID,
                    "error": true
                });
        } else {                    
            // Return task not found
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task not found",
                    "data": taskID,
                    "error": true
                });
        }
        
        // Pause a task
        let result = await taskModel.pauseTask(taskID);
        if(result.changedRows) {
            // Return response
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Taks Paused",
                    "data": result,
                    "error": false
                });
        } else {
            // Return response
            return res
                .status(500)
                .json({
                    "success": false,
                    "message": "Task cannot be paused",
                    "data": taskID,
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
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
                    "success": false,
                    "message": "Missing parameter Task ID",
                    "data": null,
                    "error": true
                });
        }

        // Resume a task
        let result = await taskModel.resumeTask(taskID);
        if(result.changedRows) {
            // Update Cache
            let task = await cache.get(taskID);
            task = JSON.parse(task);
            task.isPaused = 0;
            let updatedTask = await cache.set(taskID, JSON.stringify(task));

            // Return response
            return res
            .status(200)
            .json({
                "success": true,
                "message": "Task resumed",
                "data": taskID,
                "error": false
            });
        }

        // Return response
        return res
            .status(400)
            .json({
                "success": false,
                "message": "Task cannot be resumed",
                "data": taskID,
                "error": true
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
            });
    }
}

/**
 * TERMINATE a long running task
 * @param {Object} req 
 * @param {Object} res 
 */
const terminateTaskByID = async (req, res) => {
    try {
        // Get taskID
        const taskID = req.query.id;

        // Check if taskID was provided
        if(!taskID) {
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Missing parameter Task ID",
                    "data": null,
                    "error": true
                });
        }

        // Update Cache
        let task = await cache.get(taskID);
        task = JSON.parse(task);
        if(task && !task.isTerminated && !task.isCompleted) {
            task.isTerminated = 1;
            let updatedTask = await cache.set(taskID, JSON.stringify(task));
            console.log('Termination flag set for taskID ->', taskID);
        } else if(task && (task.isCompleted || task.isTerminated)){
            // Return cannot terminate already completed/terminated task
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Cannot terminate already completed/terminated task",
                    "data": taskID,
                    "error": true
                });
        } else {                    
            // Return task not found
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task not found",
                    "data": taskID,
                    "error": true
                });
        }

        // Terminate a task
        let result = await taskModel.terminateTask(taskID);
        if(result.changedRows) {
            // Return task terminated
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Task terminated",
                    "data": taskID,
                    "error": false
                });
        } else {
            // Return bad gateway
            return res
                .status(502)
                .json({
                    "success": false,
                    "message": "Something went wrong",
                    "data": taskID,
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,
                "data": null,
                "error": true
            });
    }
}

exports.getTasks = getTasks;
exports.getTaskByID = getTaskByID;
exports.createNewTask = createNewTask;
exports.pauseTaskByID = pauseTaskByID;
exports.resumeTaskByID = resumeTaskByID;
exports.terminateTaskByID = terminateTaskByID;

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