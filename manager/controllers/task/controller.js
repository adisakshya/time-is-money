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
const processHandler = require('../../lib/csvParser');

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
                "data": tasks,      // return all tasks
                "error": false
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,   // return error message
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
                    "message": "Missing parameter Task ID",     // return missing parameter message
                    "data": null,
                    "error": true
                });
        }

        // GET task details from cache
        let task = await cache.get(taskID);
        if(task) {
            // Return response
            // Task state is available as a JSON object,
            // represented as string in cache
            // So, extract task state from string using JSON.parse()
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Task Found",
                    "data": JSON.parse(task),
                    "error": false
                });
        } else {
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task Not Found",    // return task not found
                    "data": null,
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,   // return error message
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
        // and initialize state of the task
        let task = await cache.set(taskID, JSON.stringify({
            'isPaused': 0,
            'isCompleted': 0,
            'isTerminated': 0
        }));

        // Start CSV parsing process
        processHandler.process('largeTestCSV.csv', taskID);

        // Return response
        return res
            .status(200)
            .json({
                "success": true,
                "message": "New Task Created",  // return new task created
                "data": result,                 // return newly created taskID
                "error": false
            });
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,   // return error message
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
                    "message": "Missing parameter Task ID",       // return missing parameter message
                    "data": null,
                    "error": true
                });
        }

        // Update Cache

        // Get task by ID from cache
        let task = await cache.get(taskID);

        // Task state is available as a JSON object,
        // represented as string in cache
        // So, extract task state from string using JSON.parse()
        task = JSON.parse(task);

        // Check if task can be paused
        // A task can be paused if it is 
        //      1. present in the cache
        //      2. not terminated
        //      3. not completed
        //      4. not already paused
        if(task && !task.isTerminated && !task.isCompleted && !task.isPaused) {
            // If task can be paused
            // update state of task and set isPaused to true (1)
            task.isPaused = 1;

            // Update task state in cache
            let updatedTask = await cache.set(taskID, JSON.stringify(task));

            // Return response
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Taks Paused",       // return task paused
                    "data": taskID,                 // return taskID
                    "error": false
                });
        } else if(task && (task.isCompleted || task.isTerminated || task.isPaused)) {
            // A task cannot be paused if it doesn't follow above conditions
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Cannot pause already paused/completed/terminated task",     // return task cannot be paused
                    "data": taskID,                                                         // return taskID
                    "error": true
                });
        } else {                    
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task not found",        // return task not found
                    "data": taskID,                     // return taskID
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,       // return error message
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
                    "message": "Missing parameter Task ID",       // return missing parameter message
                    "data": null,
                    "error": true
                });
        }

        // Update Cache

        // Get task by ID from cache
        let task = await cache.get(taskID);
        
        // Task state is available as a JSON object,
        // represented as string in cache
        // So, extract task state from string using JSON.parse()
        task = JSON.parse(task);
        
        // Check if task can be resumed
        // A task can be resumed if it is 
        //      1. present in the cache
        //      2. is paused
        //      3. not terminated
        //      4. not completed
        if(task && task.isPaused && !task.isTerminated && !task.isCompleted) {
            // If task can be resumed
            // update state of task and set isPaused to false (0)
            task.isPaused = 0;
            
            // Update task state in cache
            let updatedTask = await cache.set(taskID, JSON.stringify(task));
            
            // Return response
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Task resumed",       // return task resumed
                    "data": taskID,                 // return taskID
                    "error": false
                });
        } else if(task && (!task.isPaused || task.isCompleted || task.isTerminated)){
            // A task cannot be resumed if it doesn't follow above conditions
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Cannot resume already active/completed/terminated task",   // return task cannot be resumed
                    "data": taskID,                                                        // return taskID
                    "error": true
                });
        } else {                    
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task not found",        // return task not found
                    "data": taskID,                     // return taskID
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,       // return error message
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
                    "message": "Missing parameter Task ID",       // return missing parameter message
                    "data": null,
                    "error": true
                });
        }

        // Update cached state
        
        // Get task by ID from cache
        let task = await cache.get(taskID);
        
        // Task state is available as a JSON object,
        // represented as string in cache
        // So, extract task state from string using JSON.parse()
        task = JSON.parse(task);
        
        // Check if task can be terminated
        // A task can be terminated if it is 
        //      1. present in the cache
        //      2. not terminated
        //      3. not completed
        if(task && !task.isTerminated && !task.isCompleted) {
            // If task can be terminated
            // update state of task and set isTerminated to true (1)
            task.isTerminated = 1;
            
            // Update task state in cache
            let updatedTask = await cache.set(taskID, JSON.stringify(task));
            
            // Return response
            return res
                .status(200)
                .json({
                    "success": true,
                    "message": "Task terminated",       // return task terminated
                    "data": taskID,                     // return taskID
                    "error": false
                });
        } else if(task && (task.isCompleted || task.isTerminated)){
            // A task cannot be terminated if it doesn't follow above conditions
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Cannot terminate already completed/terminated task",        // return task cannot be terminated
                    "data": taskID,                                                         // return taskID
                    "error": true
                });
        } else {                    
            // Return response
            return res
                .status(400)
                .json({
                    "success": false,
                    "message": "Task not found",        // return task not found
                    "data": taskID,                     // return taskID
                    "error": true
                });
        }
    } catch(error) {
        // Report error if any
        return res
            .status(500)
            .json({
                "success": false,
                "message": error.message,       // return error message
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
