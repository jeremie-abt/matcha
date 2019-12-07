const messageModel = require('../model/messagesModel')

const index = async (req, res) => {
  const roomId = parseInt(req.params.roomId, 10)
  messageModel
    .getMessages(roomId)
    .then(resp => {
      res.json(resp.rows)
    })
    .catch(e => {
      console.log('ouai : ', e)
      res.status(500).send('something went wrong')
    })
}

const add = async (req, res) => {
  // roomId + senderId + message
  const roomId = parseInt(req.body.roomId, 10)
  const senderId = parseInt(req.body.senderId, 10)
  const { message } = req.body

  messageModel
    .addMessages(roomId, senderId, message)
    .then(resp => {
      res.json(resp.rows[0])
    })
    .catch(e => {
      console.log('error : ', e)
      res.status(500).send('something went wrong')
    })
}

/*const del = async (req, res) => {
  // roomID => ca suppr tous les messages d'un coup quoi
} */

module.exports = {
  index,
  add
  // del
}
