// rename this file connection.js	
// and fill the XXX	

const { Client } = require('pg')	

const client = new Client({	
   user: 'jabt',	
   host: 'localhost',	
   database: 'matcha',	
})	

client.connect()	

module.exports = client 
