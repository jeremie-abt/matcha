const client = require('../database/connection')


// peut-etre tenter de faire une requette un peu plus complexe pour 
// preselectionner un peu mieux ?
// de base ce quon voulait faire c'est selectionner assez large
// pour avoir pleins de profils et faire le tri en front
// le truc c'est que la on ne selectionne pas large on selectionne tous
function searchProfils(userInfos) {
 
  let query =
    'SELECT DISTINCT ON(users.id) users.*, geoloc.lat, geoloc.long FROM users ' +
    `INNER JOIN geoloc ON users.id = geoloc.user_id WHERE users.id != ${userInfos.id} `
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
