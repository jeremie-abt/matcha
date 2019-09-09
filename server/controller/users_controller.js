// connection aux modele
let user_model = require("../model/users_model")

// ~! prob de tab

// mapper sur /api/user/id en get
function show(req, res) {
  if (!("user_id" in req.params)){
    res.status(404).send("user_id not given ! Report this beug")
    res.end()
  }
  user_model.get_user_from_id(req.params.user_id)
    .catch(e => { throw e })
    .then((response) => {
      if (response.rows.length !== 1) {
        if (response.rows.length === 0) {
          res.status(404).send("no user found")
        } else {
          res.status(404).send(
              `beug API go check il ne doit pas `
              + `rentrer ici`
          )
        }
        return 
      }
      const bind = response.rows[0]
      res.json({
          firstname: bind.firstname,
          lastname: bind.lastname
      })
    })
    .finally(() => {
      res.end()
    })
}

// mapper sur /api/user/id en post
function create(req, res) {

  console.log("voici le token depuis le create")
  console.log(req.token)
  const args_wanted = [
    'firstname', 'lastname', 'email', 'password', 'username'
  ]
  const user_account_infos = {}
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
  const Crypto = require('crypto-js')
  const hash = Crypto.SHA256(user_account_infos['password']).toString()
  user_account_infos['password'] = hash
  user_model.is_user_already_created(user_account_infos)
    .catch( err => { throw err })
    .then(response => {
      if (response.rowCount != 0) {
        throw "This user already exists"
      }
      return user_model.create_user(user_account_infos)
    })
    .then (response => {
      if (response.rowCount === 1) {
        res.write(`user : ${user_account_infos.username} successfully created`)
        res.status(200)
      }
    })
    .catch(err => { 
      res.status(404).send("")
      throw err // encore une fois voir comment gerer ca
    })
    .finally(() => {
      res.end()
      return
    })
    // a discuter mais ce pattern est plutot propre non ?  
}

// je fais un simple update pour linstant a voir si 
// on veut plus pousser apres
function update(req, res) {
  
  const fields_wanted = [
    'firstname', 'lastname', 'email',
    'username'
  ]
  let to_update_fields = {}
  fields_wanted.forEach(elem => {
    if (elem in req.body) {
      to_update_fields[elem] = req.body[elem]
    }
  })
  if (Object.keys(to_update_fields).length === 0) {
    res.status(404).send("no Data provided to update users")
    res.end()
    // c'est ok ca ?
  }
  else {
    user_model.update_user(to_update_fields, req.params.user_id)
      .catch(err => {
        throw err
      })
      .then( response => {
        if (response.rowCount === 0) {
          res.status(404).send("Update failed")
          // c ok comme fassons de gerer les erreurs ?
        } else {
          res.status(200).send("update succeeded")
        }
      })
      .finally(() => {
        res.end()
      })
  }
}

function del(req, res) {
  // je pars du principe quon delete en fonction du user_id 
  // apres de toute maniere on pourra changer ca 
  // avec nos jolies fonctions modulaires

  if (!("user_id" in req.params)){
    res.status(404).send("user_id not given ! Report this beug")
    res.end()
  }
  // pattern : premier catch pour la requette 
  // un then qui va gerer les erreurs possible 
  // sur un retour correct de requette 
  // un autre then pour dautre action
  // un catch pour gerer les errors generer par les then
  // finally pour finir la req
  // David ton avis ?
  user_model.delete_user(req.params.user_id)
    .catch(err => {
      res.status(404).send(err)
    })
    .then (response => {
      if (response.rowCount === 0) {
        throw "no user found for this id\n"
      }
      res.status(200).send("user_deleted\n")
    })
    .catch(err => {
      res.status(404).send(err)
    })
    .finally(() => {
      res.end()
    })
}

module.exports = {
  show,
  create,
  update,
  del
}
