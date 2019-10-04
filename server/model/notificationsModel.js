const client = require('../database/connection')

function createNotification(userId, receiverId, content) {
  const query =
    'INSERT INTO notifications' +
    '(user_id, receiver_id, content, created_at)' +
    'VALUES ($1, $2, $3, now())'

  return client.query(query, [userId, receiverId, content])
}

function updateNotificationToSeen(notifId) {
  const query = 'UPDATE notifications SET seen = $1 WHERE id = $2'

  return client.query(query, [true, notifId])
}

function findById(notifId) {
  const query = 'SELECT * FROM notifications WHERE id = $1'

  return query.client(query, [notifId])
}

function deleteNotif(notifId) {
  const query = 'DELETE FROM notifications WHERE id = $1'

  return client.query(query, [notifId])
}

function getAllNotification(receiverId) {
  const query = 'SELECT * FROM notifications WHERE receiver_id = $1'

  return client.query(query, [receiverId])
}

module.exports = {
  createNotification,
  updateNotificationToSeen,
  deleteNotif,
  getAllNotification,
  findById
}
