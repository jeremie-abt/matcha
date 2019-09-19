const client = require('../database/connection')

function displayBlockedUsers(userId) {
  const query =
    'SELECT users.firstname, users.lastname, users.email, users.username' +
    ' FROM users INNER JOIN blocked ON blocked.user_id = users.id' +
    ' WHERE blocked.user_id = $1;'

  return client.query(query, [userId])
}

function addUserBlocked(userId, blockedId) {
  const query =
    'INSERT INTO blocked' +
    '(user_id, blocked_id, created_at)' +
    'VALUES ($1, $2, now())'

  return client.query(query, [userId, blockedId])
}

function deleteBlocked(userId, blockedId) {
  const query = 'DELETE FROM blocked WHERE user_id = $1 AND blocked_id = $2'

  return client.query(query, [userId, blockedId])
}

module.exports = {
  addUserBlocked,
  displayBlockedUsers,
  deleteBlocked
}
