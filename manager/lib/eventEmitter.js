/**
 * Require event module
 */
var events = require('events');

/**
 * Create new event emitter
 */
var eventEmitter = new events.EventEmitter();

/**
 * Export event emitter
 * to be used for performing
 * pause/resume/terminate operations
 */
module.exports = eventEmitter;