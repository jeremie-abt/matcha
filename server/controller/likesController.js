const usersModel = require('../model/usersModel')
const likesModel = require('../model/likesModel')
const userHelper = require('../helpers/userHelper')

const index = async (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  const isExisting = userId ? await usersModel.isUserExisting(userId) : false

  if (!userId || userId < 0 || !isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  likesModel
    .displayUsersLiked(userId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No like found']
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
  const likesId = parseInt(req.body.likesId, 10)
  let isValid = false

  if (userId && likesId)
    isValid = await userHelper.checkRequestValidity(userId, likesId, 'likes')
  if (!isValid) {
    res.status(400).send('A param is missing or bad value or already exist')
    res.end()
    return
  }

  likesModel
    .addUserLiked(userId, likesId)
    .catch(() => {
      throw [500, 'Request failed']
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

const del = async (req, res) => {
  const userId = parseInt(req.body.userId, 10)
  const likesId = parseInt(req.body.likesId, 10)
  let isValid = false

  if (userId && likesId)
    isValid = await userHelper.checkUsersValidity([userId, likesId])
  if (!isValid) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  likesModel
    .deleteLike(userId, likesId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No like found']
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
