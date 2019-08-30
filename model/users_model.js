const client = require("../database/connection")
const db_names = require("./names")

// return Promise of the request
function get_user_from_id(id) {
  statement = `SELECT * FROM ${db_names.users_table_name} `
    + `WHERE user_id = $1;`
    // demander si c'est une bonne fasons le faire ??

  return client.query(statement, [ id ])
}


module.exports = {
  get_user_from_id
}