const { Client } = require('pg')

const client = new Client({
  user: 'dalauren',
  host: 'localhost',
  database: 'matcha'
})

client.connect()

// default exporting
// require(thisfile) => give directly client
module.exports = client