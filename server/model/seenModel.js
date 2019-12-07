const client = require('../database/connection')

function displayUserSeen(userId) {
  const query =
    'SELECT users.id as id, seen.timestamp as timestamp' +
    ' FROM users INNER JOIN seen ON seen.watcher_id = users.id' +
    ' WHERE seen.watched_id = $1' +
    ' ORDER BY seen.timestamp desc'

  return client.query(query, [userId])
}

function addSeen(userId, seenId) {
  const statement = "INSERT INTO seen VALUES ($1, $2, NOW());"

  return client.query(statement, [userId, seenId])
}

module.exports = {
  displayUserSeen,
  addSeen
}
