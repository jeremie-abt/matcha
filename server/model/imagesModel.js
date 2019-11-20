const client = require('../database/connection')

// get all images for 1 user
function getImagesFromUserId(id) {
  const query = 'SELECT * FROM images WHERE user_id = $1;'

  return client.query(query, [id])
}

function deleteUserImage(imageId, userId) {
  const query = 'DELETE FROM images WHERE id = $1 AND user_id = $2'
  return client.query(query, [imageId, userId])
}

function updateImage(imageId, isProfil) {
  const query = 'UPDATE images SET is_profil = $2 WHERE id = $1;'
  return client.query(query, [imageId, isProfil])
}

function addImage(userId, url) {
  const query = 'INSERT INTO images(user_id, url) VALUES ($1, $2) RETURNING id'

  return client.query(query, [userId, url])
}

function checkUserNbImages(userId) {
  const query = 'SELECT * FROM images WHERE user_id = $1;'

  return client.query(query, [userId])
}

function getProfilImage(userId) {
  const query = 'SELECT * FROM images where user_id = $1 AND is_profil = true'

  return client.query(query, [userId])
}

module.exports = {
  getImagesFromUserId,
  deleteUserImage,
  updateImage,
  checkUserNbImages,
  addImage,
  getProfilImage
}
