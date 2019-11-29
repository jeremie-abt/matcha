const client = require('../database/connection')

const getMessages = roomId => {
  const statement = 'select * from messages where room_id = $1'

  return client.query(statement, [roomId])
}

const addMessages = (roomId, senderId, message) => {
  const statement = 'insert into messages VALUES($1, $2, $3, NOW())'

  return client.query(statement, [roomId, message, senderId])
}

module.exports = {
  getMessages,
  addMessages
}
