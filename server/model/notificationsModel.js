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
    `Select user_id, max(created_at), type from notifications where` +
    ` receiver_id = $1 group by user_id, type`

  return client.query(query, [receiverId])
}

function deleteNotification(userId, receiverId, type) {
  const query = 
    "delete from notifications " + 
    "WHERE user_id=$1 AND receiver_id=$2 AND type=$3"

  return client.query(query, [userId, receiverId, type])
}

module.exports = {
  createNotification,
  updateNotificationToSeen,
  getAllNotifications,deleteNotification
}
