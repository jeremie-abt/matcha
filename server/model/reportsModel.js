const client = require('../database/connection')

function countReports(userId) {
  const query = 'SELECT COUNT(*) FROM reports WHERE reported_id = $1'

  return client.query(query, [userId])
}

function addReportedUser(userId, reportedId) {
  const query =
    'INSERT INTO reports' +
    '(user_id, reported_id, created_at)' +
    'VALUES ($1, $2, now())'

  return client.query(query, [userId, reportedId])
}

module.exports = {
  addReportedUser,
  countReports
}
