const tags_model = require('../model/tags_model')

function show(req, res) {
  const tag_id = parseInt(req.params['tag_id'])

  if(!tag_id || tag_id < 0) {
    res.status(400)
        .send('A param is missing or bad value or bad value')
    res.end()
    return
  }
  tags_model.display_tag(tag_id)
    .catch(err => { throw [500, "Request failed"] })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No_tags_found"]
      res.json(...result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const index = (req, res) => {
  tags_model.show_all_tags()
    .catch(err => { throw [500, "Request failed"] })
    .then(result => {
      if (!result.rows.length) {
        throw [ 204, "No tags" ]
      }
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

module.exports = {
  show,
  index
}
