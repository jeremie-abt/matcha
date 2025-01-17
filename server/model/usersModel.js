const client = require('../database/connection')
const ReqFormatter = require('../database/matchaRequestFormatter')

function getUserFromId(id) {
  const statement = 'SELECT * FROM users WHERE id = $1;'
  return client.query(statement, [id])
}

function getArrayOfUsers(ids) {
  const query = `SELECT * from users WHERE id = ANY (ARRAY[${ids}])`

  return client.query(query, [])
}

function isUserAlreadyCreated(userInfo) {
  const statement =
    `SELECT * FROM users ` +
    `WHERE (firstname=$1 AND lastname=$2) ` +
    `OR username = $3 ` +
    `OR email=$4`
  const values = [
    userInfo.firstname,
    userInfo.lastname,
    userInfo.username,
    userInfo.email
  ]
  return client.query(statement, values)
}

// aller chercher en plus une lat et une long
// si le mec est online on prend / si il est hors-ligne
// de puis moins de 2 heures on prend !
function getCompleteUserInfo(requiredData) {
  const statement =
    'SELECT users.*, MAX(geoloc.created_at) as latest_geoloc, geoloc.lat, ' +
    ' geoloc.long, online.*' +
    ' FROM users INNER JOIN geoloc ON geoloc.user_id = users.id ' +
    ' INNER JOIN online ON users.id = online.user_id' +
    ' where users.id = $1' +
    ' GROUP BY users.id, geoloc.lat, geoloc.long, online.user_id'

  return client.query(statement, [requiredData.id])
}

function getUserInfo(requiredData) {
  const statement = 'SELECT * from users where id = $1'

  return client.query(statement, [requiredData.id])
}
function isUserExisting(requiredData) {
  const statement = `SELECT * FROM users WHERE ${requiredData[0]} = $1`

  return client.query(statement, [requiredData[1]])
}

function createUser(userInfo) {
  const statement =
    `INSERT INTO users` +
    `(firstname, lastname, password, username, email, birthdate) ` +
    `VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
  const values = [
    userInfo.firstname,
    userInfo.lastname,
    userInfo.password,
    userInfo.username,
    userInfo.email,
    userInfo.birthdate
  ]
  return client.query(statement, values)
}

function verifyMail(id) {
  const query = new ReqFormatter()

  query.table = 'users'
  query
    .addFields({
      verified_mail: true
    })
    .where({
      and: {
        eq: {
          id
        }
      }
    })
  const [statement, args] = query.generateQuery('update')
  query.flush()
  return client.query(statement, args)
}

function updateUser(updateInfo, userId) {
  // update info Gtient ces info :
  // lastname / firstname / email / username
  // obliger sinon ca va plenter
  // bon c'est un peu shlag je vais faire la lib juste apres
  // pour generer des requettes et ce sera full modulaire

  const ReqGenerator = new ReqFormatter()
  ReqGenerator.table = 'users'
  ReqGenerator.addFields(updateInfo).where({
    and: {
      eq: {
        id: userId
      }
    }
  })
  const ret = ReqGenerator.generateQuery('update')
  return client.query(...ret)
}

function deleteUser(userId) {
  const statement = `DELETE FROM users WHERE id = $1`
  return client.query(statement, [userId])
}

function banUser(userId) {
  const statement = 'UPDATE users SET banned = true WHERE id = $1'

  return client.query(statement, [userId])
}

module.exports = {
  getUserFromId,
  isUserAlreadyCreated,
  isUserExisting,
  createUser,
  updateUser,
  deleteUser,
  verifyMail,
  getUserInfo,
  getCompleteUserInfo,
  getArrayOfUsers,
  banUser
}
