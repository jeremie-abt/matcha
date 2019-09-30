/* eslint-disable no-console */
const Crypto = require('crypto-js')
const userModel = require('../model/usersModel')

const { sendMail } = require('../helpers/MailSender')

function show(req, res) {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(404).send('no params')
    res.end()
    return
  }
  userModel
    .isUserExisting(['username', req.body.username])
    .catch(e => {
      throw e
    })
    .then(response => {
      const cryptPassword = Crypto.SHA256(password).toString()
      if (
        response.rows.length !== 1 ||
        response.rows[0].password !== cryptPassword
      ) {
        res.status(204)
        return
      }
      const user = response.rows[0]
      if (user.password === cryptPassword) {
        res.status(200)
        res.json(response.rows[0])
      }
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
  userModel.isUserAlreadyCreated(userAccountInfos)
    .catch( () => {
      res.status(404).send("something got wrong")
    })
    .then(response => {
      if (response.rowCount === 1) {
        throw "This user already exists"
      }
      return userModel.createUser(userAccountInfos)
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
 
  // a voir comment je recup le gender
  const fieldsWanted = [
    'firstname', 'lastname', 'email',
    'username', 'bio'
  ]
  if ("password" in req.body)
    console.log("password update not implemented Yet")
  const toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
  console.log("toupdate field : ", toUpdateFields)
  if (Object.keys(toUpdateFields).length === 0) {
    // !~ quel status renvoyer ??
    res.status(404).send("no Data provided to update users")
    res.end()
  }
  else {
    userModel.updateUser(toUpdateFields, req.params.userId)
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
  // je pars du principe quon delete en fonction du userId 
  // apres de toute maniere on pourra changer ca 
  // avec nos jolies fonctions modulaires

  if (!("userId" in req.params)){
    res.status(404).send("userId not given ! Report this beug")
    res.end()
  }
  // pattern : premier catch pour la requette 
  // un then qui va gerer les erreurs possible 
  // sur un retour correct de requette 
  // un autre then pour dautre action
  // un catch pour gerer les errors generer par les then
  // finally pour finir la req
  // David ton avis ?
  userModel.deleteUser(req.params.userId)
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
    userModel.verifyMail(req.cookies.permission.id)
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
