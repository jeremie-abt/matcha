const client = require('../database/connection')

// get all the users that liked the userId
function getUsersWhoLiked(userId) {
  const query =
    'SELECT users.id as id' +
    ' FROM users INNER JOIN likes ON likes.user_id = users.id' +
    ' WHERE likes.likes_id = $1;'

  return client.query(query, [userId])
}

// get all the users that the userId liked
function getLikedUsers(userId) {
  const query =
    'SELECT likes.likes_id as id' +
    ' FROM likes INNER JOIN users ON likes.user_id = users.id' +
    ' WHERE likes.user_id = $1;'

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
  getUsersWhoLiked,
  getLikedUsers,
  addUserLiked,
  deleteLike
}
