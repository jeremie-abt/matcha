const ReqFormatter = require('../database/matchaRequestFormatter')

const client = require('../database/connection')

function displayTag(tagId) {
  const query = new ReqFormatter()

  query.table = 'tags'
  query.add_fields(['name']).where({
    and: {
      eq: {
        id: tagId
      }
    }
  })
  return client.query(...query.generateQuery('select'))
}

function showAllTags() {
  const query = new ReqFormatter()

  query.table = 'tags'
  return client.query(...query.generateQuery('select'))
}

/**
 *
 * @param {array} names, list of names
 */
const idFromName = names => {
  const query = new ReqFormatter()

  query.table = 'tags'
  query.addFields(['id']).where({
    and: {
      in: {
        name: names
      }
    }
  })
  return client.query(...query.generateQuery('select'))
}

const getUserTags = userId => {
  const query =
    'select tags.* from users, tags where users.id = $1 AND tags.id = ANY(users.tags)'

  return client.query(query, [userId])
}

module.exports = {
  showAllTags,
  displayTag,
  idFromName,
  getUserTags
}
