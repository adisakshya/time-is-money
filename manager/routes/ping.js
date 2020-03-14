const express = require('express');
const router = express.Router();

/**
 * Import controller
 */
const controller = require('../controllers/ping/controller');

/**
 * Ping Route
 */
router.route('/ping')
  .get(controller.ping)
  .post(controller.ping);

module.exports = router;
