const tags_model = require('../model/tags_model')

function show(res, req) {
  if(!req.params['tag_id']) {
    res.status(400).send('A param is missing')
    res.end()
  }
  const tag_id = parseInt(req.params['tag_id'])

  tags_model.display_tag(tag_id)
    .catch(err => { throw err })
    .then(result => {
      console.log(result)
    })
    .catch(err => { throw err })
    .finally(() => res.end())
}

const index = (req, res) => {
  tags_model.show_all_tags()
    .catch(err => { throw err })
    .then(result => {
      if (!result.rows.length) {
        res.status(404).send('No tags')
        return
      }
      else res.json(result.rows)
    })
    .catch(err => { throw err })
    .finally(() => res.end())
}

// index need to be change later 
// because of its lack of security for now

module.exports = {
  show,
  index
}