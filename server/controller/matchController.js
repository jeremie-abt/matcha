const matchModel = require('../model/matchModel')
const likesModel = require('../model/likesModel')

// get all the match of someone
/**
 * Params en get :
 *  userId : int
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
            return elem.user1_id !== userId ? elem.user1_id : elem.user2_id
          })
        )
      }
    })
    .catch(() => {
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
      console.log('resp : ', typeof resp.rows[0].count)
      if (parseInt(resp.rows[0].count, 10) !== 2) {
        res.status(204).send('impossible to add match')
        return null
      }
      // je fais pas de verif si ya deja un match car en there ce ne peut pas arriver
      return matchModel.addMatch(user1, user2)
    })
    .then(resp => {
      if (resp) {
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

const del = (req, res) => {}

module.exports = {
  index,
  add,
  del
}
