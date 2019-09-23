const client = require('../database/connection')

function displayUsersLiked(userId) {
  const query =
    'SELECT users.firstname, users.lastname, users.email, users.username' +
    ' FROM users INNER JOIN likes ON likes.user_id = users.id' +
    ' WHERE likes.likes_id = $1;'

  return client.query(query, [userId])
}

function addUserLiked(userId, likesId) {
  const query =
    'INSERT INTO likes' +
    '(user_id, likes_id, created_at)' +
    'VALUES ($1, $2, now())'

  return client.query(query, [userId, likesId])
}

function deleteLike(userId, likesId) {
  const query = 'DELETE FROM likes WHERE user_id = $1 AND likes_id = $2'

  return client.query(query, [userId, likesId])
}

module.exports = {
  displayUsersLiked,
  addUserLiked,
  deleteLike
}
