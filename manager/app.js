const express = require('express');
const logger = require('morgan');

/**
 * Express
 */
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Ping Router
 */
const pingRounter = require('./routes/ping');
app.use('/api/v1/ping', pingRounter);

/**
 * Task Router
 */
const taskRouter = require('./routes/task');
app.use('/api/v1/task', taskRouter);

module.exports = app;
