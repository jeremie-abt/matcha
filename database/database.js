const { Client } = require('pg')

const client = new Client({
  user: 'dalauren',
  host: 'localhost',
  database: 'postgres'
})

const config =  {
  user: 'dalauren',
  host: 'localhost',
  database: 'matcha_db'
}
// const client = new Client(cof)

const createEnum = `CREATE TYPE sexual_orientation AS ENUM (
  'bisexual',
  'heterosexual',
  'homosexual'
);`
const createDb = 'CREATE DATABASE matcha_db'
const userTable = `CREATE TABLE USERS (
  firstname           VARCHAR(45) NOT NULL,
  lastname            VARCHAR(45) NOT NULL,
  email               VARCHAR(45) NOT NULL,
  username            VARCHAR(45) NOT NULL,
  password            VARCHAR(255) NOT NULL,
  verified_mail       BOOLEAN default false,
  gender              VARCHAR(45) DEFAULT 'female',
  age                 integer DEFAULT 18,
  birthdate           DATE   DEFAULT NULL,
  bio                 TEXT DEFAULT '',
  tags                integer[],
  localisation        VARCHAR(255) DEFAULT '',
  sexual_orientation  sexual_orientation default 'bisexual',
  popularity_score    FLOAT DEFAULT 0.5,
  online              BOOLEAN DEFAULT false
  );`

client.connect()
client.query(createDb, (err, res) => {
  if (err) {
    console.log(err)
    res.status(404).send(err)
  } 
  else {
    //need await for that shiit. the client close before the callback is launched
    console.log('yo')
    client.query(createEnum, (err, res) => {
      console.log('prout')
      if (err) console.log(err)
    })
    console.log('yoooooo')
    client.end()
  }
})
// const createTables = () => {
//   pool.query(userTable, (err, res) => {
//     if (err) console.log(err)
//     else console.log('TABLES created')
//   })  
// }

// pool.connect(err => {
//   if (err) console.error('Failed to connect 😡!', err)
//   else {
//     pool.query(createEnum, (err, res) => {
//       if (err) console.log(err)
//       else console.log('Enum created 🤖!')
//     })
//     pool.query(createDb, (err, res) => {
//       if (err) console.log(err)
//       else {
//         client = new Client(config)
//         console.log ('Database created 👺!')
//         createTables()
//       }
//     })
//   }
// })
