// rename this file connection.js
// and fill the XXX

const { Client } = require('pg')

const client = new Client({
  user: 'jabt',
  database: 'matcha',
  password: 'admin'
})
client.connect()

module.exports = client
