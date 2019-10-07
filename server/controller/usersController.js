/* eslint-disable no-console */
const Crypto = require('crypto-js')

const userModel = require('../model/usersModel')
const tagsModel = require('../model/tagsModel')

const { sendMail } = require('../helpers/MailSender')
const createToken = require('../helpers/ManageToken')

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
        res.status(400).send("wrong Data")
        return
      }
      const user = response.rows[0]
      if (user.password === cryptPassword) {
        const token = createToken(response.rows[0].id)
        res.status(200).send(token)
      }
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

async function update(req, res) {

  function _handleSexualOrientation() {
    // evidemment ca part du principe que c'est un radio
    // et que les deux ne sont pas coche
    const sexe = Object.entries(req.body.sexe).filter(x => x[1] === true)
    return (
      sexe.length === 1 ?
          {gender: sexe[0][0]} :
          {}
    )
  }

  async function _handleTags() {
    let idTagsUpdate
    let namesTagsToUpdate = 
        Object.entries(req.body.tags).filter(elem => elem[1] === true)
    namesTagsToUpdate = namesTagsToUpdate.map(elem => elem[0])
    try {
      idTagsUpdate = await tagsModel.idFromName(namesTagsToUpdate)
    } catch (e) {
      console.log("\n\nERROR : ", e, "\n\n")
      throw "Comment on gere cette erreur !"
    }
    return idTagsUpdate.rows
    /* return tagsModel.idFromName(namesTagsToUpdate)
      .then(resp => {
        if (resp.rowCount >= 0) {
          const tagsId = resp.rows.map(elem => elem.id)
          return (
            userModel.updateUser({tags: tagsId}, req.params.userId)
          )
        }
        throw "Something went wrong !"
      })
      .then(resp => {
        if (resp.rowCount === 1)
          res.status(200).send("Users get successfully updated")
        else 
          throw "User not updated"
      })
      .catch(() => {
        // res.status(500).send("Internal Errors !")
      }) */
  }

  // a voir comment je recup le gender
  const fieldsWanted = [
    'firstname', 'lastname', 'email',
    'username', 'bio', 
  ]
  if ("password" in req.body)
    console.log("password update not implemented Yet")
  let toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
  // bad pattern je sais mais flem de tout refaire
  if ("sexe" in req.body){
    const testObj = _handleSexualOrientation()
    toUpdateFields = { ...toUpdateFields, ...testObj }
  }
    // alors attentino si tu coches les deux ca fait apparaitre un beug
    // faut mettre un radio
  if ("tags" in req.body && Object.keys(req.body.tags).length !== 0){
    let tagsId = await _handleTags()
    tagsId = tagsId.map(elem => elem.id)
    toUpdateFields = { ...toUpdateFields, tags: tagsId}
  }
  
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
  confirmationMail,
  ManageAuthentification
}
