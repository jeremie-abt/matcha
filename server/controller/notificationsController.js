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
    .getAllNotifications(receiverId)
    .catch(err => {
      throw err
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

const getSenderInfos = (req, res) => {
  let { ids } = req.params
  ids = ids.split(',').map(elem => parseInt(elem, 10))
  usersModel
    .getArrayOfUsers(ids)
    .catch(err => {
      throw err
    })
    .then(result => {
      if (result.rowCount) res.json(result.rows)
      else res.status(204).send('no content')
    })
    .catch(err => {
      throw err
    })
    .finally(() => res.end())
}

const add = async (req, res) => {
  const { type } = req.body
  const userId = parseInt(req.body.userId, 10)
  const receiverId = parseInt(req.body.receiverId, 10)
  let isValid = false

  if (userId && receiverId && type)
    isValid = await userHelper.checkUsersValidity([userId, receiverId])
  if (!isValid) {
    res.status(400).send('A param is missing or bad value or already exist')
    res.end()
    return
  }
  notificationsModel
    .createNotification(userId, receiverId, type)
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
  update,
  getSenderInfos
}
