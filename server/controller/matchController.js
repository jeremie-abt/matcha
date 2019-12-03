const matchModel = require('../model/matchModel')
const likesModel = require('../model/likesModel')

// get all the match of someone
/**
 * Params en get :
 *  userId : int
 *  return : array of array : [room_id, the one that liked the current user]
 */
const index = (req, res) => {
  const userId = parseInt(req.params.userId, 10)

  matchModel
    .getMatch(userId)
    .then(resp => {
      if (resp.rowCount === 0) res.status(204).send()
      else {
        res.json(
          resp.rows.map(elem => {
            return elem.user1_id !== userId
              ? [elem.room_id, elem.user1_id]
              : [elem.room_id, elem.user2_id]
          })
        )
      }
    })
    .catch(e => {
      console.log('oui : ', e)
      res.status(500).send('Something Went Wrong')
    })
}

/**
 * params POST :
 *  user1: int
 *  user2: int
 */
const add = (req, res) => {
  const { user1 } = req.body
  const { user2 } = req.body

  likesModel
    .verifyMatch(user1, user2)
    .then(resp => {
      if (parseInt(resp.rows[0].count, 10) !== 2) {
        res.status(204).send('impossible to add match')
        return null
      }
      // je fais pas de verif si ya deja un match car en there ce ne peut pas arriver
      return matchModel.addMatch(user1, user2)
    })
    .then(resp => {
      if (resp) {
        // je laisse == car rowcount est une
        if (resp.rowCount == 1) {
          res.status(200).send()
        } else {
          res.status(500).send('error for adding match')
        }
      }
    })
    .catch(e => {
      res.status(500).send('something went wrong')
    })
  // verify que les deux ont bien des likes
}

const del = (req, res) => {
  // userId && likesId

  const { userId } = req.body
  const { likesId } = req.body

  matchModel
    .delMatch(userId, likesId)
    .then(() => {
      res.status(200).send()
    })
    .catch(() => {
      res.status(500).send('something Went Wrong')
    })
}

module.exports = {
  index,
  add,
  del
}
