const tagsModel = require('../model/tagsModel')

function show(req, res) {
  const tagId = parseInt(req.params.tagId, 10)

  if (!tagId || tagId < 0) {
    res.status(400).send('A param is missing or bad value or bad value')
    res.end()
    return
  }
  tagsModel
    .displayTag(tagId)
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount) throw [204, 'No_tags_found']
      res.json(...result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const index = (req, res) => {
  tagsModel
    .showAllTags()
    .catch(() => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rows.length) {
        throw [204, 'No tags']
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
