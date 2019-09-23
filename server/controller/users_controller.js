const Crypto = require('crypto-js')
const nodemailer = require('nodemailer')
const userModel = require("../model/users_model")
const mailIdentifier = require("../config/mailIdentifiant")

// a voir comment faire du lazy load pour ces deux la !
const {objectInnerMerge} = require('../helpers/objectManipulation')
const domainName = require('../config/domainName')


function show(req, res) {

  res.clearCookie("permission")
  const fieldsWanted = [
      "firstname", "lastname", "username",
      "email", "sexual_orientation", "localisation",
      "tags", "bio"
  ]
  if (!("user_id" in req.params)){
    res.status(404).send("user_id not given ! Report this beug")
    res.end()
  }
  userModel.get_user_from_id(req.params.user_id)
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
      res.json(objectInnerMerge(response.rows[0], fieldsWanted))
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

  const argsWanted = [
    'firstname', 'lastname', 'email', 'password', 'username'
  ]
  const userAccountInfos = {}

  argsWanted.forEach((element) => {
    if (!(element in req.body)) {
      throw `${element} not present !`
    }
    const value = req.body[element]
    if (typeof value !== 'string' || value === '') {
      throw `field ${element} is not a string !`
    }
    userAccountInfos[element] = value
  })
  const hash = Crypto.SHA256(userAccountInfos.password).toString()
  userAccountInfos.password = hash
  userModel.is_user_already_created(userAccountInfos)
    .catch( () => {
      res.status(404).send("something got wrong")
    })
    .then(response => {
      if (response.rowCount === 1) {
        throw "This user already exists"
      }
      return userModel.create_user(userAccountInfos)
    })
    .then (response => {
      if (response.rowCount === 1) {
        // eslint-disable-next-line no-use-before-define
        const token = generateToken(res, response.rows[0].id)
        // eslint-disable-next-line no-use-before-define
        sendMail(token, userAccountInfos.email, "/confirmationMail/")
        if (token !== -1) {
          res.status(200)
          res.write(
              `user : ${userAccountInfos.username} successfully `
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
  
  const fieldsWanted = [
    'firstname', 'lastname', 'email',
    'username'
  ]
  const toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
  if (Object.keys(toUpdateFields).length === 0) {
    res.status(404).send("no Data provided to update users")
    res.end()
    // c'est ok ca ?
  }
  else {
    userModel.update_user(toUpdateFields, req.params.user_id)
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
  userModel.delete_user(req.params.user_id)
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
const confirmationMail = (req, res) => {
  if (typeof req.cookies.permission === "undefined"){
    res.status(404).send("Bad token or Cookie")
    return
  }
  const sessionToken = req.cookies.permission.token
  const {token} = req.params
  
  if (sessionToken === token) {
    res.clearCookie("permission")
    userModel.verify_mail(req.cookies.permission.id)
      .catch(() => {
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
      .catch( () => { throw "err" } )
  }
  else 
    res.status(404).send("bad token")
}

/**
 * 
 * @param {string} token 
 * @param {string} mail 
 * @param {string} path path in the mail URL ( correspond to the endpoint
 *                      which will handle the actual request )
 */
function sendMail(token, mail, path) {
  // je veux lui envoyer un lien :
  // https://localhost:8081/api/auth/confirm
  
  const link = 
    `${domainName  }api/auth${path}${
     token}`
  const BodyMsg = 'Your about to find the love of your '
      + 'life, Clink on the following link if you want : ' 
      + `<a href='${link}'>Bite</a>`
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
  res.cookie("permission", {
    token,
    id
  })
  return token
}

module.exports = {
  show,
  create,
  update,
  del,
  confirmationMail
}
