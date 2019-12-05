const usersModel = require('../model/usersModel')
const likesModel = require('../model/likesModel')
const userHelper = require('../helpers/userHelper')

// get full profil of users that liked userId
// to display them after
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
  likesModel
    .getUsersWhoLiked(userId)
    .then(result => {
      if (result.rowCount === 0) return []

      const promises = []
      result.rows.forEach(elem => {
        promises.push(usersModel.getUserInfo({ id: elem.id }))
      })
      return Promise.all(promises)
    })
    .then(result => {
      const rowResult = result.map(elem => {
        return elem.rows[0]
      })
      res.status(200).json(rowResult)
    })
    .catch(e => {
      res.status(500).send('Something Went Wrong')
    })
}

// Get only the Ids of the users that have liked userId
// Its almost the same function as index, but in reverse
// and it return only id => see if any changement is needed here !
const getLiked = async (req, res) => {
  console.log("salut a tous les copains !")
  const userId = parseInt(req.params.userId, 10)

  const isExisting = userId
    ? await usersModel.isUserExisting(['id', userId])
    : false
  // je ne fais volontairement aucune gestion d'erreur car faut qu'on voit
  // une facons clean d'uniformiser tout ca avec des middleware
  // pour avoir une procedure similaire pour chaque func histoire de pas
  // se repeter, car la on fait de la merde !

  if (!userId || userId < 0 || !isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    return
  }

  likesModel
    .getLikedUsers(userId)
    .then(resp => {
      res.status(200).send(
        resp.rows.map(elem => {
          return Object.values(elem)[0]
        })
      )
    })
    .catch(e => {
      res.status(500).send('Something Went Wrong')
    })
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
  getLiked,
  add,
  del
}
