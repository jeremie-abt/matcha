const Crypto = require('crypto-js')
const verifyData = require('../helpers/validation')

/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

const userModel = require('../model/usersModel')
const notificationsModel = require('../model/notificationsModel')
const { sendMail } = require('../helpers/MailSender')

const { createToken } = require('../helpers/ManageToken')

async function show(req, res) {
  const id = req.params.userId ? req.params.userId : req.tokenInfo.id
  // je vais toucher a pas mal de truc a voir si c'est toujours
  // utile a la fin !
  const notif = await notificationsModel.getAllNotifications(id)
  userModel
    .getCompleteUserInfo({ id })
    .then(resp => {
      if (resp.rowCount === 0) {
        return userModel.getUserInfo({ id })
      }
      delete resp.rows[0].password
      delete resp.rows[0].user_id
      res.json({ ...resp.rows[0], notifications: notif.rows })
    })
    .then(resp => {
      if (resp && resp.rowCount === 1) {
        res.json({ ...resp.rows[0], notifications: notif.rows })
      }
    })
    .catch(e => {
      console.log('\n\nEEEE : ', e, '\n\n')
      res.status(500).send(e)
    })
    .finally(() => res.end())
}

function ManageAuthentification(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(500).send('somenthing went wrong')
  }
  userModel.isUserExisting(['username', username]).then(response => {
    const cryptPassword = Crypto.SHA256(password).toString()
    if (
      response.rows.length !== 1 ||
      response.rows[0].password !== cryptPassword
    ) {
      res.send('Wrong data')
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

  if (!verifyData(userAccountInfos)) {
    res.status(500).send('invalid Data')
    return
  }
  const hash = Crypto.SHA256(userAccountInfos.password).toString()
  userAccountInfos.password = hash
  userModel
    .isUserAlreadyCreated(userAccountInfos)
    .then(response => {
      if (response.rowCount === 1) {
        res.status(500).send('This user already exists')
        return false
      }
      return userModel.createUser(userAccountInfos)
    })
    .then(response => {
      if (response && response.rowCount === 1) {
        res.status(200).json(response.rows[0])
      } else if (response) {
        res.status(500).send('something went wrong !')
      }
    })
    .catch(err => {
      console.log('\n\nerr : ', err, '\n\n')
      res.status(404).send(err)
    })
}

function updatePassword(req, res) {
  if (req.body.password === undefined) {
    res.status(404).send('Wrong Data')
  }

  res.clearCookie('mailToken')
  const hash = Crypto.SHA256(req.body.password).toString()
  userModel
    .updateUser(
      {
        password: hash
      },
      req.tokenInfo.id
    )
    .then(() => {
      res.status(200).send()
    })
    .catch(e => {
      console.log(e)
      res.status(404).send()
    })
}

function update(req, res) {
  const fieldsWanted = [
    'firstname',
    'lastname',
    'email',
    'username',
    'bio',
    'tags',
    'gender'
  ]
  const toUpdateFields = {}
  fieldsWanted.forEach(elem => {
    if (elem in req.body) {
      toUpdateFields[elem] = req.body[elem]
    }
  })
  if (!verifyData(toUpdateFields)) {
    res.status(500).send('invalid Data')
    return
  }
  if (Object.keys(toUpdateFields).length === 0) {
    // !~ quel status renvoyer ??
    res.status(404).send('no Data provided to update users')
    res.end()
  } else {
    userModel
      .updateUser(toUpdateFields, req.params.userId)
      .catch(err => {
        throw err
      })
      .then(response => {
        if (response.rowCount === 0) {
          res.status(404).send('Update failed')
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
  if (!('userId' in req.params)) {
    res.status(404).send('userId not given ! Report this beug')
    res.end()
  }
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

function sendTokenMail(req, res) {
  const token = Crypto.lib.WordArray.random(28).toString()
  const { redirectionLink, email, id } = req.body
  sendMail(token, email, redirectionLink, id)
  res.cookie('mailToken', token).send('Ok')
}

const verifyMail = (req, res) => {
  const { userId } = req.params

  userModel
    .verifyMail(userId)
    .then(resp => {
      if (resp.rowCount !== 1) {
        res.status(500).send('something got wrong')
      } else {
        res.clearCookie('mailToken')
        res.status(200).send('email confirmed')
      }
      res.end()
    })
    .catch(e => {
      console.log('error : ', e)
      res.status(500).send('something got wrong')
    })
}

const confirmationMail = (req, res) => {
  const cookieToken = req.cookies.mailToken
  const { token } = req.params

  if (cookieToken === token) {
    res.status(200).send('OK')
  } else res.status(404).send('nop')
}

module.exports = {
  show,
  create,
  update,
  updatePassword,
  del,
  confirmationMail,
  verifyMail,
  ManageAuthentification,
  sendTokenMail
}
