/* eslint-disable radix */
const seenModel = require('../model/seenModel')
const usersModel = require('../model/usersModel')
const scoreModel = require('../model/scoreModel')

const index = async (req, res) => {

  const userId = parseInt(req.params.userId, 10)
  const isExisting = userId
    ? await usersModel.isUserExisting(['id', userId])
    : false

  if (!userId || userId < 0 || !isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }
  seenModel
    .displayUserSeen(userId)
    .then(result => {
      if (!result.rowCount === 0) return ([])

      const promises = []
      result.rows.forEach(elem => {
        promises.push(
          usersModel.getUserInfo({id: elem.id})
        )
      })
      return (Promise.all(promises))
    })
    .then(result => {
      const rowResult = result.map(elem =>{
        return elem.rows[0]
      })
      res.status(200).json(rowResult)
    })
    .catch((e) => {
      console.log("erreur : ", e)
      res.status(500).send("Something Went Wrong")
    })
}

const add = (req, res) => {
  const userId = parseInt(req.body.userId, 10)
  const seenId = parseInt(req.body.seenId, 10)

  seenModel.addSeen(userId, seenId)
  .then((resp) => {
    scoreModel.updateScore('seen', seenId)
  })
  .then(() => {
    res.status(200).send()
  })
  .catch((e) => {
    console.log("e : ", e)
    res.status(500).send('something went wrong')
  })
}

module.exports = {
  index,
  add
}
