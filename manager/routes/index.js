const express = require('express');
const router = express.Router();

/**
 * Import controller
 */
const controller = require('../controllers/index/controller');

router.route('/')
  .get(controller.getTasks);

router.route('/task')
  .get(controller.getTaskByID);

module.exports = router;
