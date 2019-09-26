const client = require('../database/connection')

function getUserFromId(id) {
  const statement = 'SELECT * FROM users WHERE id = $1;'
  return client.query(statement, [id])
}

function isUserAlreadyCreated(userInfo) {
  const statement =
    'SELECT * FROM users ' +
    'WHERE (firstname=$1 AND lastname=$2) ' +
    'OR username = $3 ' +
    'OR email=$4'
  const values = [
    userInfo.firstname,
    userInfo.lastname,
    userInfo.username,
    userInfo.email
  ]

  return client.query(statement, values)
}

function isUserExisting(requiredData) {
  const statement = `SELECT * FROM users WHERE ${requiredData[0]} = $1`

  return client.query(statement, [requiredData[1]])
}

function createUser(userInfo) {
  const statement =
    'INSERT INTO users' +
    '(firstname, lastname, password, username, email) ' +
    'VALUES ($1, $2, $3, $4, $5)'
  const values = [
    userInfo.firstname,
    userInfo.lastname,
    userInfo.password,
    userInfo.username,
    userInfo.email
  ]

  return client.query(statement, values)
}

function updateUser(updateInfo, userId) {
  // update info contient ces info :
  // lastname / firstname / email / username
  // obliger sinon ca va plenter
  // bon c'est un peu shlag je vais faire la lib juste apres
  // pour generer des requettes et ce sera full modulaire
  const statement =
    'UPDATE users ' +
    'SET firstname = $1, ' +
    'lastname = $2, ' +
    'username = $3, ' +
    'email = $4' +
    'WHERE id = $5'
  const values = [
    updateInfo.firstname,
    updateInfo.lastname,
    updateInfo.username,
    updateInfo.email,
    userId
  ]

  return client.query(statement, values)
}

function deleteUser(userId) {
  const statement = 'DELETE FROM users WHERE id = $1'

  return client.query(statement, [userId])
}

module.exports = {
  getUserFromId,
  isUserAlreadyCreated,
  isUserExisting,
  createUser,
  updateUser,
  deleteUser
}
