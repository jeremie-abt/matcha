const req_formatteur = require('../database/matcha_request_formatter')
const client = require('../database/connection')

function display_tag(tag_id) {
  const query = new req_formatteur()
  
  query.table = 'tags'
  query
    .add_fields([ 'name' ])
    .where({
      and: {
        eq: {
          id: tag_id
        }
      }
    })
  return client.query(...query.generate_query('select'))
}

function show_all_tags() {
  const query = new req_formatteur()

  query.table = 'tags'
  return client.query(...query.generate_query('select'))
}

module.exports = {
  show_all_tags,
  display_tag
}
