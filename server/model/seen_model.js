const req_formatteur = require('../database/matcha_request_formatter')
const client = require('../database/connection')

function display_user_seen(user_id) {
  const query = new req_formatteur()
  query.table = 'seen'

  query
    .add_fields([ 'watcher_id' ])
    .where({
      and: {
        eq: { watched_id: user_id }
      }
    })
  return client.query(...query.generate_query('select'))
}

module.exports = {
  display_user_seen
}