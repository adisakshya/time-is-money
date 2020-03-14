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
app.use('/', pingRounter);

module.exports = app;
