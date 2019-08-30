// connection aux modele
let user_model = require("../model/users_model")


// mapper sur /api/user/id en get
module.exports.show = function(req, res) {
if (!("user_id" in req.params)){
    throw "user_id not given ! Report this beug";
}
user_id = req.params.user_id
req_promise = user_model.get_user_from_id(user_id)
req_promise
    .then((response) => {

      if (response.rows.length !== 1) {
        if (response.rows.length === 0) {
          res.status(404).send("no user found")
        } else {
          res.status(404).send(`beug API go check il ne doit pas  `
            + `rentrer ici`)
        }
      }
      //res.json(response.rows[0])
      bind = response.rows[0]
      response_object = {
          firstname: bind.firstname,
          lastname: bind.lastname
      }
      res.json(response_object)
        
    })
    //.catch(e => { throw e })
// faire intervenir des view correct
}

// mapper sur /api/user/id en post
module.exports.create = function(req, res) {

// recup les infos en post et faire la creation de profil
// verifier de maniere solide qu'il n'est pas deja co
// qu'il n'est pas deja en attente

// pour l'instant ce que je vais faire c'est simplement 
// faire une requette select pour cette id et si ca me retourne 
// 0 rows c'est ok 

//  La on va faire une requette avec le champs mail
// 
  // ce que je veux :
  // email / firstname / lastname
  const args_wanted = [
    'firstname', 'lastname', 'email', 'password', 'username'
  ]
  let user_account_infos = {}
  args_wanted.forEach((element) => {
    if (!(element in req.body)) {
      throw `${element} not present !`
    }
    value = req.body[element]
    if (typeof value !== 'string' || value === '') {
      throw `field ${element} is not a string !`
    }
    user_account_infos[element] = value
  })
  
  let Crypto = require('crypto-js')
  let hash = Crypto.SHA256(user_account_infos['password']).toString()
  user_account_infos['password'] = hash
  
  let p_resp = user_model.is_user_already_created(user_account_infos)

  p_resp
    .then((response) => {
      if (response.rowCount != 0) {
        res.status(404).send("This user already exists")
        res.end()
        //onsole.log("je return\n\n\n")
        return ;
      }
      p_req = user_model.create_user(user_account_infos)
      p_req
        .then((p_resp) => {
          if (p_resp.rowCount === 1) {
            res.write(`user : ${user_account_infos.username} successfully created`)
            res.status(200)
            res.end()
          }
        })
      })
}

module.exports.udpate = function(req, res) {
res.write("not implemented Yet")
res.end()
}

module.exports.delete = function(req, res) {
res.write("not implemented Yet")
res.end()
}
