/* eslint-disable no-console */
const Crypto = require('crypto-js')

const userModel = require('../model/usersModel')
const { sendMail } = require('../helpers/MailSender')

const { createToken, generateMailToken } = 
  require('../helpers/ManageToken')

// je met le user id dans le token donc 
// je fais request avec le user id mais on pourra changer
function show(req, res) {
 
  userModel.getUserInfo({id : req.tokenInfo.id})
    .then(resp => {
      if (resp.rowCount !== 1)
        res.status(500).send("something got Wrong")
      res.json(resp.rows[0])
    })
    .catch(e => {
      res.status(500).send(e)
    })
  }


// GOAL : 
//   when user is not logged in take some info
//   request BDD to see if Data are correct !
//   If yes create and return a token
//   which will be passed to each request who need
//   auth !
function ManageAuthentification(req, res) {

  const {username, password} = req.body
  
  if (!username || !password){
    res.status(500).send("somenthing went wrong")
  }
  userModel.isUserExisting(["username", username])
    .then(response => {
      const cryptPassword = Crypto.SHA256(password).toString()
      if (
        response.rows.length !== 1 ||
        response.rows[0].password !== cryptPassword
      ) {
        res.status(401).send("Wrong data")
        return
      }
      const user = response.rows[0]
      if (user.password === cryptPassword) {
        const token = createToken(response.rows[0].id)
        res.status(200).send(token)
      }
    })
}

function create(req, res) {

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
    .then(response => {
      if (response.rowCount === 1) {
        res.status(500).send("This user already exists")
        return false
      }
      return userModel.createUser(userAccountInfos)
    })
    .then (response => {

      // enfaite maintenan la logique du mail c le front qui va gerer
      if (response && response.rowCount === 1) {
        res.status(200).json(response.rows[0])
        res.end()
      } else {
        res.status(500).send("something went wrong !")
        res.end()
      }
    })
    .catch(err => {
      console.log("\n\nerr : ", err, "\n\n")
      res.status(404).send(err)
    })
}

function update(req, res) {

  const fieldsWanted = [
    'firstname', 'lastname', 'email',
    'username', 'bio', 'tags', 'gender'
  ]
  if ("password" in req.body)
    console.log("password update not implemented Yet")
  const toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
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

  if (!("userId" in req.params)){
    res.status(404).send("userId not given ! Report this beug")
    res.end()
  }
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

function sendTokenMail(req, res) {

  const token = Crypto.lib.WordArray.random(28).toString()
  const { redirectionLink, email, id } =
      req.body

  sendMail(token, email, redirectionLink, id)
  res.cookie("mailToken", token).send("Ok")
}

const confirmationMail = (req, res) => {

  const cookieToken = req.cookies.mailToken
  const { token, userId } = req.params

  if (cookieToken === token) {
    userModel.verifyMail(userId)
    .then(resp => {
      if (resp.rowCount !== 1){
        res.status(500).send("something got wrong")
      }
      else {
        res.clearCookie("mailToken")
        res.status(204).send("email confirmed")
      }
      res.end()
    })
    .catch((e) => {
      console.log("error : ", e)
      res.status(500).send("something got wrong")
    })
  }
  else 
    res.status(404).send("bad token")
}

module.exports = {
  show,
  create,
  update,
  del,
  confirmationMail,
  ManageAuthentification,
  sendTokenMail
}
