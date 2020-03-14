/**
 * CSV Parser
 * Parse the CSV file
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
 * Parse Test CSV
 */
const _parser = async () => {
    // CREATE a readstream
    fs.createReadStream(path.resolve(__dirname, '../utils/test_csv', 'largeTestCSV.csv'))
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
         * Log row data
         */
        .on('data', (row) => {
            console.log(row);
        })

        /**
         * On completion of parsing
         * log number of rows parsed
         */
        .on('end', (rowCount) => {
            console.log(`Parsed ${rowCount} rows`);
        });
};

exports.csvParser = _parser;