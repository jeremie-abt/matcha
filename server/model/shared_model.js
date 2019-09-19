const client = require('../database/connection')

function check_relation(user_id, target_id, table) {
  const query = 
    `SELECT * from ${table}`
    + ` WHERE user_id = $1 AND ${table}_id = $2`

  return client.query(query, [ user_id, target_id ])
}

module.exports = {
  check_relation
}
