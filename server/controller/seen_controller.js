const seen_model = require('../model/seen_model')
const users_model = require('../model/users_model')

const index = (req, res) => {
  const user_id = parseInt(req.params['user_id'])

  if (!user_id || user_id < 0) {
    res
      .status(400)
      .send('A param is missing or bad value or bad value')
    res.end()
    return
  }
  seen_model.display_user_seen(user_id)
    .catch(err => { throw [ 500, "Request failed" ]})
    .then(async (result) => {
      if (!result.rowCount)
        throw [204, "No_tags_found"]
      const tab = result.rows.map(row => {
        return row.watcher_id
      })
      const t = await users_model.get_multiple_user(tab)
      console.log(t)
      res.json(tab)
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
