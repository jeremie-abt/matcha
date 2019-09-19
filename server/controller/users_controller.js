const user_model = require("../model/users_model")
const Crypto = require('crypto-js')


function show(req, res) {

  const fields_wanted = [
      "firstname", "lastname", "username",
      "email", "sexual_orientation", "localisation",
      "tags", "bio"
  ]
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
      let objectInnerMerge = 
          require('../helpers/object_manipulation').objectInnerMerge
      res.json(objectInnerMerge(response.rows[0], fields_wanted))
    })
    .finally(() => {
      res.end()
    })
}

// mapper sur /api/user/id en post
function create(req, res) {
  // donne required pour creer un compte :
  //  - Mail
  //  - username
  //  - name
  //  - firstname
  //  - password secure

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
  const hash = Crypto.SHA256(user_account_infos['password']).toString()
  user_account_infos['password'] = hash
  user_model.is_user_already_created(user_account_infos)
    .catch( err => {
      res.status(404).send("something got wrong")
    })
    .then(response => {
      if (response.rowCount === 1) {
        throw "This user already exists"
      }
      return user_model.create_user(user_account_infos)
    })
    .then (response => {
      if (response.rowCount === 1) {
        const token = generateToken(res, response.rows[0].id)
        if (token !== -1) {
          res.status(200)
          res.write(
              `user : ${user_account_infos.username} successfully `
              + `created, you must validate this account by email`)
        } else {
          res.status(404)
          res.write("something got wrong")
        }
        res.end()
      }
    })
    .catch(err => {
      res.status(404).send(err)
    })
}

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

// c'est OK de mettre ca ici ?
const confirmation = (req, res) => {

  const sessionToken = req.cookies["permission"]["token"]
  const token = req.params.token
  
  console.log("cookiies : ", req.cookies["permission"])
  if (sessionToken === token) {
    res.clearCookie("permission")
    user_model.verify_mail(req.cookies["permission"]["id"])
      .catch(err => {
        res.status(500).send("something got wrong")
      })
      .then(resp => {
        if (resp.rowCount !== 1){
          res.write("something got wrong")
          res.status(500)
        }
        else{
          res.write("email Confirmed")
          res.status(204)
        }
        res.end()
      })
      .catch(err => console.log("freeere !", err))
  }
  else 
    res.status(404).send("bad token")
}

function sendMail(token, mail) {
  // je veux lui envoyer un lien :
  // https://localhost:8081/api/auth/confirm
  
  const domainName = require('../config/domainName')
  const link = 
    domainName + "api/auth/confirm/"
    + token
  const BodyMsg = 'Your about to find the love of your '
      + 'life, Clink on the following link if you want : ' 
      + `<a href='${link}'>Bite</a>`
  const nodemailer = require('nodemailer')
  const mailIdentifier = require("../config/mailIdentifiant")
  const transporter = nodemailer.createTransport({
    sendmail: true,
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: mailIdentifier.username,
        pass: mailIdentifier.password
    }
  })
  transporter.sendMail({
    from: 'no-reply@matcha.om', // sender address
    to: mail, // list of receivers
    subject: 'Inscription matcha', // Subject line
    html: BodyMsg
  })
}

function generateToken(res, id) {
  const token = Crypto.lib.WordArray.random(28).toString()
  console.log("token generated : ", token)
  res.cookie("permission", {
    token: token,
    id: id
  })
  sendMail(
    token,
    user_account_infos["email"]
  )
  return token
}

module.exports = {
  show,
  create,
  update,
  del,
  confirmation
}
