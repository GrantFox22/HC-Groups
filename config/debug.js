const debug = require('debug')

debug.log = console.log.bind(console)

module.exports = debug
