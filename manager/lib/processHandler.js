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
 * Require connection pool
 */
const pool = require('../rdbms/pool');

/**
 * Process Handler
 * @param {String} csvName 
 * @param {String} taskID 
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
        console.log(`[INFO] ${taskID} -> ${data}`);
    });

    /**
     * Error from child process
     */
    process.stderr.on('error', (data) => {
        console.log(`[ERROR] ${taskID} -> ${data}`);
    });

    /**
     * Closed child process
     */
    process.on('close', (code, signal) => {
        console.log(`[CLOSED] Task -> ${taskID}`);
    });

    /**
     * Terminated Child Process
     */
    process.on('exit', () => {
        console.log(`[TERMINATED] Task -> ${taskID}`);
    });

    /**
     * Paused Child Process
     */
    process.on('SIGSTOP', () => {
        console.log(`[PAUSED] Task -> ${taskID}`);
    });

    /**
     * Resumed Child Process
     */
    process.on('SIGCONT', () => {
        console.log(`[RESUMED] Task -> ${taskID}`);
    });

}

exports.processHandler = processHandler;

/** 
 * exec('kill -TERM ' + process.pid.toString());
 * 
 * exec('kill -STOP ' + process.pid.toString());
 * 
 * exec('kill -CONT ' + process.pid.toString());
 */