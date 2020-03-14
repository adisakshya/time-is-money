/**
 * Controller
 */

/**
 * Require processHandler
 */
const processHandler = require('../../lib/processHandler');

/**
 * Process uplaoded CSV
 * @param {object} req 
 * @param {object} res 
 */
const _uploadRequestHandler = async (req, res) => {
    try {
        // GET test csv file name
        const csvFileName = req.query.csv;

        // Start processing test CSV file
        processHandler.processCSV(csvFileName);

        return res
            .status(200)
            .json({
                "message": "Your request has been submitted"
            });
    } catch(error) {
        return res
            .status(500)
            .json({
                "message": error
            });
    }
}

exports.uploadRequestHandler = _uploadRequestHandler;