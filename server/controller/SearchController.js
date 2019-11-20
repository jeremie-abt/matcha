const searchModel = require('../model/SearchModel')

function searchProfils(req, res) {
  searchModel
    .searchProfils(req.query)
    .then(resp => {
      res.json(resp.rows)
    })
    .catch(() => {
      res.status(500).send('something went wrong')
    })
}

module.exports = {
  searchProfils
}
