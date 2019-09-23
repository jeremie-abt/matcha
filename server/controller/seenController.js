/* eslint-disable radix */
const seenModel = require('../model/seenModel')
const usersModel = require('../model/usersModel')

const index = async (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  const isExisting = userId ? await usersModel.isUserExisting(userId) : false

  if (!userId || userId < 0 || !isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  seenModel
    .displayUserSeen(userId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No_watchers_found']
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

module.exports = {
  index
}
