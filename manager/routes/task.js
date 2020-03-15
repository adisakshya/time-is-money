const express = require('express');
const router = express.Router();

/**
 * Import controller
 */
const controller = require('../controllers/task/controller');

/**
 * GET details all tasks
 */
router.route('/')
  .get(controller.getTasks);

/**
 * GET task details by ID
 */
router.route('/view')
  .get(controller.getTaskByID);

module.exports = router;
