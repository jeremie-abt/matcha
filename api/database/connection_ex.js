// rename this file connection.js	
// and fill the XXX	

const { Client } = require('pg')	

const client = new Client({	
   user: 'XXX',	
   host: 'XXX',	
   database: 'XXX',	
   password: 'XXX',	
   port: 000	
})	

client.connect()	

module.exports = client 
