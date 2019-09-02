const client = require("../database/connection")

// get all images for 1 user
function get_images_from_user_id(id) {
  const query =
    `SELECT * FROM images WHERE user_id = $1;`

  return client.query(query, [ id ])
}

function delete_user_image(image_id, user_id) {
  const query = 
    `DELETE FROM images WHERE id = $1`
    + `AND user_id = $2`
  // count row deleted to check if it was deleted or not
  return client.query(query, [ image_id, user_id ])
}

function update_image_position(position, image_id) {
  const query =
    `UPDATE images SET position = $1`
    + `WHERE id = $2;`
  // update the position of a image / 1 === profil
  return client.query(query, [ position, image_id ])
}

function add_image(user_id, position, url) {
  const query =
    'INSERT INTO images'
    + `(user_id, position, url)`
    + `VALUES ($1, $2, $3)`
  
  return client.query(query, [ user_id, position, url ])
}

function check_user_nb_images(user_id) {
  const query = 
    `SELECT * FROM images WHERE user_id = $1;`

  return client.query(query, [ user_id ])
}

module.exports = {
  get_images_from_user_id,
  delete_user_image,
  update_image_position,
  check_user_nb_images,
  add_image
}
