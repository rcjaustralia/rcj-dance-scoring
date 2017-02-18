var rethinkAddress = process.env['RETHINK_ADDRESS'] || 'rethinkdb';
var thinky = require('thinky')({
    host:rethinkAddress,
    db: 'rcja'
})

module.exports = thinky;