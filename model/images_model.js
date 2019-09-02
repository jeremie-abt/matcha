const client = require("../database/connection")

// get all images for 1 user
function get_images_from_user_id(id) {
  const statement =
   `SELECT * FROM images WHERE user_id = $1;`

  return client.query(statement, [ id ])
}

module.exports = {
  get_images_from_user_id
}
