const client = require('../database/connection')

function display_users_liked(user_id) {
  const query =
    `SELECT users.firstname, users.lastname, users.email, users.username` 
    + ` FROM users INNER JOIN likes ON likes.user_id = users.id`
    + ` WHERE likes.likes_id = $1;`
    
  return client.query(query, [ user_id ])
}

function add_user_liked(user_id, likes_id) {
  const query =
    `INSERT INTO likes`
    + `(user_id, likes_id, created_at)`
    + `VALUES ($1, $2, now())`

  return client.query(query, [ user_id, likes_id ])
}

function delete_like(user_id, likes_id) {
  const query =
    `DELETE FROM likes`
    + ' WHERE user_id = $1 AND likes_id = $2'
  
    return client.query(query, [ user_id, likes_id ])
}

module.exports = {
  display_users_liked,
  add_user_liked,
  delete_like
}
