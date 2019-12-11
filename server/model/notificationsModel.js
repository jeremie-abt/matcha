const client = require('../database/connection')

function createNotification(userId, receiverId, type) {
  const query =
    'INSERT INTO notifications' +
    '(user_id, receiver_id, type, created_at)' +
    'VALUES ($1, $2, $3, now()) ON CONFLICT(user_id, receiver_id, type) DO NOTHING'

  return client.query(query, [userId, receiverId, type])
}

function updateNotificationToSeen(notifId) {
  const query = 'UPDATE notifications SET seen = $1 WHERE id = $2'

  return client.query(query, [true, notifId])
}

function getAllNotifications(receiverId) {
  const query =
    `Select distinct on (user_id, type) user_id, type, id from notifications where` +
    ` receiver_id = $1 AND seen=false GROUP BY user_id, type, id`

  return client.query(query, [receiverId])
}

function deleteNotification(notifId) {
  const query = 'delete from notifications WHERE id=$1'

  return client.query(query, [notifId])
}

function deleteAllNotifications(userId) {
  const query = 'delete from notifications WHERE receiver_id=$1'

  return client.query(query, [userId])
}

module.exports = {
  createNotification,
  updateNotificationToSeen,
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications
}
