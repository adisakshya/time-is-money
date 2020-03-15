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
// add cache
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
        processHandler.processCSV('largeTestCSV.csv', taskID);

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

        // Pause a task
        let result = await taskModel.pauseTask(taskID);
        if(result.changedRows) {
            // Update Cache
            let task = await cache.get(taskID);
            task = JSON.parse(task);
            task.isPaused = 1;
            let updatedTask = await cache.set(taskID, JSON.stringify(task));

            // Return response
            return res
            .status(200)
            .json({
                "success": true,
                "message": "Taks Paused",
                "data": result,
                "error": false
            });
        }

        // Return response
        return res
            .status(400)
            .json({
                "success": false,
                "message": "Task cannot be paused",
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

        // Update cached state
        // Get cached state
        let task = await cache.get(taskID);
        if(task) {
            // Check if task can be terminated
            // A task can be terminated if it is not completed
            if(!(task.isCompleted)) {
                // If task exists then set isTerminated flag to true
                task = JSON.parse(task);
                task.isTerminated = 1;

                // Update cached state
                let updatedTask = await cache.set(taskID, JSON.stringify(task));
                console.log('Termination flag set for taskID ->', taskID);
            } else {
                // Return completed task cannot be terminated
                return res
                    .status(400)
                    .json({
                        "success": false,
                        "message": "Completed task cannot be terminated",
                        "data": taskID,
                        "error": true
                    });
            }
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
        // Update flag in database
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
