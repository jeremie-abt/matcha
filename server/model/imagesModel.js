const client = require('../database/connection')

// get all images for 1 user
function getImagesFromUserId(id) {
  const query = 'SELECT * FROM images WHERE user_id = $1;'

  return client.query(query, [id])
}

function deleteUserImage(imageId, userId) {
  const query = 'DELETE FROM images WHERE id = $1 AND user_id = $2'
  // count row deleted to check if it was deleted or not
  return client.query(query, [imageId, userId])
}

function updateImagePosition(imageId) {
  const query = 'UPDATE images SET is_profil = true WHERE id = $1;'
  // update the position of a image / 1 === profil
  return client.query(query, [imageId])
}

function addImage(userId, url) {
  const query = 'INSERT INTO images(user_id, url) VALUES ($1, $2) RETURNING id'

  return client.query(query, [userId, url])
}

function checkUserNbImages(userId) {
  const query = 'SELECT * FROM images WHERE user_id = $1;'

  return client.query(query, [userId])
}

module.exports = {
  getImagesFromUserId,
  deleteUserImage,
  updateImagePosition,
  checkUserNbImages,
  addImage
}
