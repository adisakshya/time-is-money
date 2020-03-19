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

/**
 * START new long running task
 */
router.route('/start')
  .post(controller.createNewTask);

/**
 * PAUSE a long running task
 */
router.route('/pause')
  .put(controller.pauseTaskByID);

/**
 * RESUME a long running task
 */
router.route('/resume')
  .put(controller.resumeTaskByID);

/**
 * TERMINATE a long running task
 */
router.route('/terminate')
  .put(controller.terminateTaskByID);

module.exports = router;
