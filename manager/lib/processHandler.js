/**
 * Process Handler
 * to create a child process to handle
 * CSV parsing and insertion in database
 */

/**
 * Require Child Process Module
 */
const { spawn, exec } = require('child_process');
const cache = require('../lib/cache');

/**
 * Require event emitter
 */
const eventEmitter = require('./eventEmitter');

/**
 * Snooze Utility
 * @param {Integer} ms 
 */
// const snooze = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Process Handler
 * @param {String} csvName 
 * @param {String} taskID 
 */
const processHandler = async (csvName, taskID) => {

    return new Promise(async (resolve, reject) => {

        /**
         * Spawn Child Process
         */
        const process = spawn('node', ['./lib/csvParser.js', csvName, taskID]);

        /**
         * Set process ID
         */
        let task = await cache.get(taskID);
        task = JSON.parse(task);
        if(task.processID == -1) {
            task.processID = process.pid;
            let updatedTask = await cache.set(taskID, JSON.stringify(task));
        }

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
            reject(data);
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
            resolve('Terminated');
        });

        /**
         * Utilize snooze utility
         * to perform wait and terminate action on process pause event
         * 
         * Wait for certain threshold period on pause request
         * if the process isn't resumed in this time interval
         * then terminate the process else if resumed then start normal execution.
         */
        // async function waitAndTerminate (processID = process.pid) {
        //     console.log('Waiting for 5 seconds before termination...');
        //     await snooze(5000);
        //     console.log('Terminating...');
        // }

        /**
         * Redis event listener
         */
        eventEmitter.addListener('set', async (key) => {
            // Get task that was updated
            let task = await cache.get(key);
            task = JSON.parse(task);
            if(task.isPaused) {
                // Task was paused
                console.log('[PAUSED] Task ->', key);
                // exec('kill -TERM ' + process.pid);
                resolve('Paused');
            } else if(task.isTerminated) {
                // Task was terminated
                exec('kill -TERM ' + task.processID.toString());
                resolve('Terminated');
            }
        });
    
    });

}

exports.processHandler = processHandler;
