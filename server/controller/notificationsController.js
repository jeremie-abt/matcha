/* eslint-disable no-useless-return */
const notificationsModel = require('../model/notificationsModel')
const usersModel = require('../model/usersModel')
const userHelper = require('../helpers/userHelper')

const index = async (req, res) => {
  const receiverId = parseInt(req.params.receiverId, 10)
  const isExisting = receiverId
    ? await usersModel.isUserExisting(['id', receiverId])
    : false
  if (!receiverId || !isExisting) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  notificationsModel
    .getAllNotification(receiverId)
    .catch(() => {
      throw [500, 'request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No notifications found']
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const add = async (req, res) => {
  let { userId, receiverId } = req.body
  const { content } = req.body
  let isValid = false

  userId = parseInt(req.body.userId, 10)
  receiverId = parseInt(req.body.receiverId, 10)
  if (userId && receiverId && content)
    isValid = await userHelper.checkUsersValidity([userId, receiverId])
  if (!isValid) {
    res.status(400).send('A param is missing or bad value or already exist')
    res.end()
    return
  }
  notificationsModel
    .createNotification(userId, receiverId, content)
    .catch(err => {
      throw err
    })
    .then(result => {
      if (result.rowCount) res.status(200)
      else throw [400, 'Error during add']
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const update = (req, res) => {
  const notifId = parseInt(req.body.notifId, 10)
  if (!notifId) {
    res.status(400).send('A param is missing or bad value or already exist')
    res.end()
    return
  }
  notificationsModel
    .updateNotificationToSeen(notifId)
    .catch(() => {
      throw [500, 'request failed']
    })
    .then(result => {
      if (result.rowCount) res.status(200)
      else throw [400, 'Error during add']
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

module.exports = {
  index,
  add,
  update
}
