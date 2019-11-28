const client = require('../database/connection')

const addMatch = (user1, user2) => {
  const statement = 'insert into match (user1_id, user2_id) VALUES($1, $2);'

  return client.query(statement, [user1, user2])
}

// return an array of match
const getMatch = userId => {
  const statement =
    'SELECT * FROM match  WHERE (user1_id = $1 AND user2_id != $1) OR (user2_id = $1 AND user1_id != $1);'

  return client.query(statement, [userId])
}

module.exports = {
  addMatch,
  getMatch
}
