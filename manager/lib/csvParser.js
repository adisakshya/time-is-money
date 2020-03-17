/**
 * Parse the CSV file 
 * and call the utility
 * to insert the data array in 
 * MySQL database
 */

/**
 * File system and Path utility
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
 */
const parser = async (filename, taskID) => {
    
    /**
     * Data Array to store CSV information
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
            dataArray.push(row);            
        })
        /**
         * On completion of parsing
         * log number of rows parsed
         */
        .on('end', async (rowCount) => {
            console.log(`Parsed ${rowCount} rows`);
            saveToMySQL(dataArray, taskID);
        });
};

exports.process = parser;