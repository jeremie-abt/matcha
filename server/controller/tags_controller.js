const tags_model = require('../model/tags_model')

function show(req, res) {
  const tag_id = parseInt(req.params['tag_id'])
  if(!tag_id || tag_id < 0) {
    res.status(400).send('A param is missing or bad value or bad value')
    res.end()
    return
  }
  tags_model.display_tag(tag_id)
    .catch(err => { throw err })
    .then(result => {
      if (!result.rowCount)
        res.status(204).send('No tags found')
      else res.json(...result.rows)
    })
    .catch(err => { throw err })
    .finally(() => res.end())
}

const index = (req, res) => {
  tags_model.show_all_tags()
    .catch(err => { throw err })
    .then(result => {
      if (!result.rows.length) {
        res.status(204).send('No tags')
        return
      }
      else res.json(result.rows)
    })
    .catch(err => { throw err })
    .finally(() => res.end())
}

module.exports = {
  show,
  index
}
