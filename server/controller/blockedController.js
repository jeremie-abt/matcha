const blockedModel = require('../model/blockedModel')
const likesModel = require('../model/likesModel')
const matchModel = require('../model/matchModel')
const usersModel = require('../model/usersModel')
const userHelper = require('../helpers/userHelper')

const index = async (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  const isExisting = userId
    ? await usersModel.isUserExisting(['id', userId])
    : false
  if (!isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  blockedModel
    .displayBlockedUsers(userId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No blocked user found']
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const add = async (req, res) => {
  const userId = parseInt(req.body.userId, 10)
  const blockedId = parseInt(req.body.blockedId, 10)
  let isValid = false

  if (userId && blockedId) {
    isValid = await userHelper.checkRequestValidity(
      userId,
      blockedId,
      'blocked'
    )
  }
  if (!isValid) {
    res.status(400).send('A param is missing or bad value or already exist')
    res.end()
    return
  }
  blockedModel
    .addUserBlocked(userId, blockedId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (result) return matchModel.delMatch(userId, blockedId)
    })
    .then(result => {
      likesModel.deleteLike(userId, blockedId)
      if (result.rowCount) res.status(200)
      else throw [400, 'Error during add']
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const del = async (req, res) => {
  const userId = parseInt(req.body.userId, 10)
  const blockedId = parseInt(req.body.blockedId, 10)
  let isValid = false

  if (userId && blockedId) {
    isValid = await userHelper.checkUsersValidity([userId, blockedId])
  }
  if (!isValid) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  blockedModel
    .deleteBlocked(userId, blockedId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No blocked user found']
      else res.status(200)
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
  del
}
