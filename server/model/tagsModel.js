const ReqFormatteur = require('../database/matchaRequestFormatter')
const client = require('../database/connection')

function displayTag(tagId) {
  const query = new ReqFormatteur()

  query.table = 'tags'
  query.add_fields(['name']).where({
    and: {
      eq: {
        id: tagId
      }
    }
  })
  return client.query(...query.generate_query('select'))
}

function showAllTags() {
  const query = new ReqFormatteur()

  query.table = 'tags'
  return client.query(...query.generate_query('select'))
}

module.exports = {
  showAllTags,
  displayTag
}
