const client = require('../database/connection')

const getMessages = roomId => {
  const statement = 'select * from messages where room_id = $1'

  return client.query(statement, [roomId])
}

const addMessages = (roomId, senderId, message) => {
  // je suis pas sur du returning mais comme c'est un message ca me semble
  // un peu logque d'avoir les infos en rep pour le client
  // surtout le created_at ??
  const statement = 'insert into messages VALUES($1, $2, $3, NOW()) RETURNING *'

  console.log("roomID : ", roomId, " sendeId : ", senderId, " message : ", message);
  return client.query(statement, [roomId, message, senderId])
}

module.exports = {
  getMessages,
  addMessages
}
