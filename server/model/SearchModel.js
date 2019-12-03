const client = require('../database/connection')

function searchProfils(userInfos) {
  const query =
    'SELECT DISTINCT ON(users.id) users.*, geoloc.lat, geoloc.long FROM users ' +
    'INNER JOIN geoloc ON users.id = geoloc.user_id ' +
    ' WHERE users.gender = $1 ' +
    'ORDER BY users.id, geoloc.created_at DESC '

  return client.query(query, [userInfos.sexual_orientation])
}

module.exports = {
  searchProfils
}
