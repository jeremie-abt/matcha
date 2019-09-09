const jwt = require('jsonwebtoken');
const client = require('../database/connection')
let psql_generator = require("../database/matcha_request_formatter")
psql_generator = new psql_generator
const Crypto = require('crypto-js')

const signing_key = "prout" 
// mettre soit une variable d'env ici
// ou alors une auth en clef publique prive


// functionn to verify, so typically when loggin
// or creation count etc ...
function sign_in(req, res, next) {
  
  // alors je fais ma req en bdd ici je ne fais pas
  // de modele car c'est dans utils 
  // c'est OK ou je fais de la merde ?

  let {username, password} = req.body
  password = Crypto.SHA256(password).toString()
  psql_generator.where({
    and: {
      eq: {
        username: username,
        password, password
      }
    }
  })
    .table = "users"
  let ret = psql_generator.generate_query("select")
  client.query(...ret)
  .then(resp => {
    if (resp.rowCount <= 0
      || !resp.rows.verified_mail)
      res.status(404).send("can't login") 
      // a voir peut etre une gestion un peu plus pousse
      // Generation of token
      let token = jwt.sign({
        firstname: 'test',
        lastname: 'test',
        email: 'test',
        username: 'test',
      }, signing_key);
      req.token = token
      console.log("sifjsfj")
      next()
    })
    .catch(err => {
      res.status(500).send("Beug with database Request")
    })
}

module.exports = {
  sign_in
}
