const client = require('../database/connection')

function display_blocked_users(user_id) {
  const query = `SELECT users.firstname, users.lastname, users.email, users.username` 
  + ` FROM users INNER JOIN blocked ON blocked.user_id = users.id`
  + ` WHERE blocked.user_id = $1;`

  return client.query(query, [ user_id ])
}

function add_user_blocked(user_id, blocked_id) {
  const query =
    `INSERT INTO blocked`
    + `(user_id, blocked_id, created_at)`
    + `VALUES ($1, $2, now())`

  return client.query(query, [ user_id, blocked_id ])
}

function blocked_is_existing(user_id, blocked_id) {
  const query = 
    `SELECT * from blocked`
    + ` WHERE user_id = $1 AND blocked_id = $2`

  return client.query(query, [ user_id, blocked_id ])
}

function delete_blocked(user_id, blocked_id) {
  const query =
    `DELETE FROM blocked`
    + ' WHERE user_id = $1 AND blocked_id = $2'

  return client.query(query, [ user_id, blocked_id ])
}

module.exports = {
  add_user_blocked,
  display_blocked_users,
  blocked_is_existing,
  delete_blocked
}
