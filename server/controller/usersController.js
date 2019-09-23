// connection aux modele
const Crypto = require('crypto-js')
const userModel = require('../model/usersModel')
const { objectInnerMerge } = require('../helpers/objectManipulation')

// ~! prob de tab

// mapper sur /api/user/id en get
function show(req, res) {
  const fieldsWanted = [
    'firstname',
    'lastname',
    'username',
    'email',
    'sexual_orientation',
    'localisation',
    'tags',
    'bio'
  ]
  if (!('userId' in req.params)) {
    res.status(404).send('userId not given ! Report this beug')
    res.end()
  }
  userModel
    .getUserFromId(req.params.userId)
    .catch(e => {
      throw e
    })
    .then(response => {
      if (response.rows.length !== 1) {
        if (response.rows.length === 0) {
          res.status(404).send('no user found')
        } else {
          res.status(404).send('beug API go check il ne doit pas rentrer ici')
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
  const argsWanted = ['firstname', 'lastname', 'email', 'password', 'username']
  const userAccountInfos = {}
  argsWanted.forEach(element => {
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
  userModel
    .isUserAlreadyCreated(userAccountInfos)
    .catch(err => {
      throw err // a voir comment on gere
      // je ne sais pas si c'est un bon pattern
      // mais lidee c de recup lerreur de la fonction
      // si yen a eu une car c une requette donc la requette peut foirer
      // c un peu bizarre quand meme car une erreur de requette ou
      // de bdd t sense la gerer direct dans le controller non ?
      // a discuter
    })
    .then(response => {
      if (response.rowCount !== 0) {
        throw 'This user already exists'
      }
      return userModel.createUser(userAccountInfos)
    })
    .then(response => {
      if (response.rowCount === 1) {
        res.write(`user : ${userAccountInfos.username} successfully created`)
        res.status(200)
      }
    })
    .catch(err => {
      res.status(404).send('')
      throw err // encore une fois voir comment gerer ca
    })
    .finally(() => {
      res.end()
    })
  // a discuter mais ce pattern est plutot propre non ?
}

// je fais un simple update pour linstant a voir si
// on veut plus pousser apres
function update(req, res) {
  const fieldsWanted = ['firstname', 'lastname', 'email', 'username']
  const toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
  if (Object.keys(toUpdateFields).length === 0) {
    res.status(404).send('no Data provided to update users')
    res.end()
    // c'est ok ca ?
  } else {
    userModel
      .updateUser(toUpdateFields, req.params.userId)
      .catch(err => {
        throw err
      })
      .then(response => {
        if (response.rowCount === 0) {
          res.status(404).send('Update failed')
          // c ok comme fassons de gerer les erreurs ?
        } else {
          res.status(200).send('update succeeded')
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

  if (!('userId' in req.params)) {
    res.status(404).send('userId not given ! Report this beug')
    res.end()
  }
  // pattern : premier catch pour la requette
  // un then qui va gerer les erreurs possible
  // sur un retour correct de requette
  // un autre then pour dautre action
  // un catch pour gerer les errors generer par les then
  // finally pour finir la req
  // David ton avis ?
  userModel
    .deleteUser(req.params.userId)
    .catch(err => {
      res.status(404).send(err)
    })
    .then(response => {
      if (response.rowCount === 0) {
        throw 'no user found for this id\n'
      }
      res.status(200).send('user_deleted\n')
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
