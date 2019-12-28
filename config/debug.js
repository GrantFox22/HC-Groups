const debug = require('debug')

/*
 * This allows CloudWatch to create just one log entry for multi-line messages.
 */
debug.log = console.log.bind(console)

module.exports = debug
