const client = require('../database/connection')

function countReports(userId) {
  const query = 'SELECT COUNT(*) FROM reports WHERE report_id = $1'

  return client.query(query, [userId])
}

function addReportedUser(userId, reportedId) {
  const query =
    'INSERT INTO reports' +
    '(user_id, report_id, created_at)' +
    'VALUES ($1, $2, now())'

  return client.query(query, [userId, reportedId])
}

module.exports = {
  addReportedUser,
  countReports
}
