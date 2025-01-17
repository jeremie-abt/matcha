const client = require('../database/connection')


// effacer
function searchProfils(userInfos) {
 
  let query =
    'SELECT DISTINCT ON(users.id) users.*, online.is_online, online.last_connection, geoloc.lat, geoloc.long FROM users ' +
    `INNER JOIN geoloc ON users.id = geoloc.user_id ` +
    `INNER JOIN images ON users.id = images.user_id ` +
    `INNER JOIN online ON users.id = online.user_id ` +
    `WHERE users.id != ${userInfos.id} `
  if (userInfos.sexual_orientation !== 'bisexual'){
    query += ' AND users.gender = $1 ' 
  }
  query += ' ORDER BY users.id, geoloc.created_at DESC '
  if (userInfos.sexual_orientation !== 'bisexual')
    return client.query(query, [userInfos.sexual_orientation])
  return client.query(query)
}

module.exports = {
  searchProfils
}
