const client = require('../database/connection')
const ReqFormatter = require('../database/matchaRequestFormatter')

function getUserFromId(id) {
  const statement = 'SELECT * FROM users WHERE id = $1;'
  return client.query(statement, [id])
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

function getUserInfo(requiredData) {
  const Query = new ReqFormatter()

  Query.table = 'users'
  Query.where({
    and: {
      eq: {
        ...requiredData
      }
    }
  })
  return client.query(...Query.generateQuery('select'))
}

function isUserExisting(requiredData) {
  const statement = `SELECT * FROM users WHERE ${requiredData[0]} = $1`

  return client.query(statement, [requiredData[1]])
}

function createUser(userInfo) {
  const statement =
    `INSERT INTO users` +
    `(firstname, lastname, password, username, email) ` +
    `VALUES ($1, $2, $3, $4, $5) RETURNING id`
  const values = [
    userInfo.firstname,
    userInfo.lastname,
    userInfo.password,
    userInfo.username,
    userInfo.email
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
  banUser
}
