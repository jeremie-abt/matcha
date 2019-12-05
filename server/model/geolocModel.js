const client = require('../database/connection')

const getGeoloc = userId => {
  const query =
    'SELECT * FROM geoloc WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1'

  return client.query(query, [userId])
}

const addGeoloc = (userId, lat, long) => {
  const query =
    'INSERT INTO geoloc' +
    '(user_id, lat, long, created_at)' +
    'VALUES ($1, $2, $3, now())'

  return client.query(query, [userId, lat, long])
}

const deleteGeoloc = userId => {
  const query = 'DELETE FROM geoloc WHERE user_id = $1'

  return client.query(query, [userId])
}

module.exports = {
  getGeoloc,
  addGeoloc,
  deleteGeoloc
}
