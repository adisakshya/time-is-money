/**
 * Process Handler
 * to create a child process to handle
 * CSV parsing and insertion in database
 */

/**
 * Require Child Process Module
 */
const { spawn, exec } = require('child_process');

/**
 * Process Handler
 * @param {String} csvName [Name of CSV file]
 * @param {String} taskID   [Task ID]
 */
const processHandler = async (csvName, taskID) => {

    /**
     * Spawn Child Process
     */
    const process = spawn('node', ['./lib/csvParser.js', csvName, taskID]);
    
    /**
     * Data from child process
     */
    process.stdout.on('data', (data) => {
        console.log(`[CHILDPROCESS ${process.pid} INFO] ${taskID} -> ${data}`);
    });

    /**
     * Error from child process
     */
    process.stderr.on('error', (data) => {
        console.log(`[CHILDPROCESS ${process.pid} ERROR] ${taskID} -> ${data}`);
    });

    /**
     * Closed child process
     */
    process.on('close', (code, signal) => {
        console.log(`[CHILDPROCESS ${process.pid} CLOSED] Task -> ${taskID}`);
    });

    /**
     * Terminated Child Process
     */
    process.on('exit', () => {
        console.log(`[CHILDPROCESS ${process.pid} TERMINATED] Task -> ${taskID}`);
    });

}

exports.processHandler = processHandler;
