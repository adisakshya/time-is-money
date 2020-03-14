const express = require('express');
const router = express.Router();

/**
 * Import controller
 */
const controller = require('../controllers/index/controller');

/**
 * Index Route
 */
router.route('/')
  .get(controller.uploadRequestHandler);

module.exports = router;
