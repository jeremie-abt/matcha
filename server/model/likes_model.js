const client = require('../database/connection')

function display_user_liked(user_id) {
  const query =
    `SELECT users.firstname, users.lastname, users.email, users.username` 
    + ` FROM users INNER JOIN likes ON likes.user_id = users.id`
    + ` WHERE likes.liked_id = $1;`
    
  return client.query(query, [ user_id ])
}

function add_user_liked(user_id, liked_id) {
  const query =
    `INSERT INTO likes`
    + `(user_id, liked_id, created_at)`
    + `VALUES ($1, $2, now())`

  return client.query(query, [ user_id, liked_id ])
}

function like_already_existing(user_id, liked_id) {
  const query = 
    `SELECT * from likes`
    + ` WHERE user_id = $1 AND liked_id = $2`

  return client.query(query, [ user_id, liked_id ])
}

function delete_like(user_id, liked_id) {
  const query =
    `DELETE FROM likes`
    + ' WHERE user_id = $1 AND liked_id = $2'
  
    return client.query(query, [ user_id, liked_id ])
}

module.exports = {
  display_user_liked,
  add_user_liked,
  delete_like,
  like_already_existing
}
