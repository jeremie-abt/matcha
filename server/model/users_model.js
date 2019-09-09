const client = require("../database/connection")

function get_user_from_id(id) {
  const statement = `SELECT * FROM users `
                  + `WHERE id = $1;`
  return client.query(statement, [ id ])
}

function is_user_already_created(user_info) {

  const statement = `SELECT * FROM users `
                  + `WHERE (firstname=$1 AND lastname=$2) `
                  + `OR username = $3 `
                  + `OR email=$4`
  const values = [
      user_info.firstname, user_info.lastname,
      user_info.username, user_info.email
    ]
  return client.query(statement, values)
}

function is_user_existing(user_id) {
  const statement = `SELECT id FROM users`
                    + ` WHERE id = $1`

  return client.query(statement, [ user_id ])
}

function create_user(user_info) {

  const statement = `INSERT INTO users`
                  + `(firstname, lastname, password, username, email) `
                  + `VALUES ($1, $2, $3, $4, $5)`
  const values = [
      user_info.firstname, user_info.lastname,
      user_info.password, user_info.username, user_info.email
  ]
  return client.query(statement, values)
}

function update_user(update_info, user_id) {

  // update info contient ces info :
  // lastname / firstname / email / username
  // obliger sinon ca va plenter
  // bon c'est un peu shlag je vais faire la lib juste apres
  // pour generer des requettes et ce sera full modulaire
  const statement = `UPDATE users `
                    + `SET firstname = $1, `
                    + `lastname = $2, `
                    + `username = $3, `
                    + 'email = $4'
                    + `WHERE id = $5`
  const values = [
    update_info.firstname, update_info.lastname,
    update_info.username, update_info.email, user_id
  ]
  return client.query(statement, values)
}

function delete_user(user_id) {
  const statement = `DELETE FROM users `
                    + `WHERE id = $1`
  return client.query(statement, [ user_id ])
}

module.exports = {
  get_user_from_id,
  is_user_already_created,
  is_user_existing,
  create_user,
  update_user,
  delete_user
}
