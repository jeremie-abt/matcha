const seen_model = require('../model/seen_model')
const users_model = require('../model/users_model')

const index = async (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  let is_existing = user_id
    ? await users_model.is_user_existing(user_id)
    : false

  if (!user_id || user_id < 0 || !is_existing.rowCount) {
    res
      .status(400)
      .send('A param is missing or bad value')
    res.end()
    return
  }
  seen_model.display_user_seen(user_id)
    .catch(err => { 
      throw [ 500, "Request failed" ]
    })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No_watchers_found"]
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1]) 
    })
    .finally(() => res.end())
}

module.exports = {
  index
}
