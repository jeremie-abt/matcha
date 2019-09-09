const client = require('../database/connection')

function display_user_seen(user_id) {
  const query =
    `SELECT users.firstname, users.lastname, users.email, users.username` 
    + ` FROM users INNER JOIN seen ON seen.watcher_id = users.id`
    + ` WHERE seen.watched_id = $1;`
    
  return client.query(query, [ user_id ])
}

module.exports = {
  display_user_seen
}