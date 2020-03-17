/**
 * Parse the CSV file 
 * and call the utility
 * to insert the data array in 
 * MySQL database
 */

/**
 * Require file system and path utility
 */
const fs = require('fs');
const path = require('path');

/**
 * Require fast-csv module
 */
const csv = require('fast-csv');

/**
 * Require saveToMySQL module
 */
const saveToMySQL = require('./saveToMySQL').saveToMySQL;

/**
 * Parse Test CSV
 * Already saved on disk
 * @param {String} filename [Filename of test CSV]
 * @param {String} taskID   [Task ID]
 */
const parser = async (filename, taskID) => {

    /**
     * Mark initialization of the task
     */
    console.log('[TASK] Started ->', taskID);
    
    /**
     * Data Array to store CSV information
     * This will be used as parameter to perform
     * insert operation on database
     */
    let dataArray = Array();

    /**
     * Create a readstream
     */
    fs.createReadStream(path.resolve(__dirname, '../utils/test_csv', filename))
        /**
         * Pipe
         */
        .pipe(csv.parse({
            headers: true
        }))
        
        /**
         * Report Error
         */
        .on('error', (error) => {
            console.error(error);
        })

        /**
         * Push CSV row data into the dataArray
         */
        .on('data', (row) => {
            // Extract row fields from dataArray
            // 'row' is an object and must be converted into an array
            // so as to be used in insert operation on database

            // Define empty arrau
            let arr = Array();

            // Set rowID for this row,
            // this will be the unique id for the row among all rows,
            // for the same task
            let rowID = dataArray.length + 1;

            // Push taskID and rowID in the array
            arr.push(taskID);
            arr.push(rowID);

            // Convert 'row' object into array object
            let objArr = Array(row);

            // Extract field values using map function
            // and concatenate with array containing taskID and rowID
            // Ex.
            //      arr = [ taskID, rowID ]
            //
            //      row = {
            //          'field1': 'test',
            //          'field2': 'test',
            //          'field3': 'test',
            //          ... so on
            //      }
            //      
            //      fields = [ taskID, rowID, field1, field2, field3, ...so on]
            //
            //This fields array can directly be used in the insert operation
            const fields = arr.concat(objArr.map(x => Object.values(x))[0]);

            // Push field array in the dataArray
            dataArray.push(fields);            
        })
        /**
         * On completion of parsing
         */
        .on('end', async (rowCount) => {
            // Pass dataArray and cooresponding taskID
            // to be inserted in the database
            saveToMySQL(dataArray, taskID);
        });
};

exports.process = parser;