/**
 * Controller
 */

/**
 * Handle Ping request
 * @param {object} req 
 * @param {object} res 
 */
const _ping = async (req, res) => {

    return res
        .status(200)
        .json({
            "message": "Pong"
        });

}

exports.ping = _ping;