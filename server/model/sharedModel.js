const client = require('../database/connection')

function checkRelation(userId, targetId, table) {
  const query = `SELECT * from ${table} WHERE user_id = $1 AND ${table}_id = $2`

  return client.query(query, [userId, targetId])
}

module.exports = {
  checkRelation
}
