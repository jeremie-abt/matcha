// rename this file connection.js
// and fill the XXX

const { Client } = require('pg')

const client = new Client({
  user: 'jabt',
  password: 'admin',
  host: 'localhost',
  database: 'matcha'
})
client.connect()

module.exports = client
