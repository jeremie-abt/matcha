const searchModel = require('../model/SearchModel')
const blockedModel = require('../model/blockedModel')

function searchProfils(req, res) {
  searchModel
    .searchProfils(req.query)
    .then(async resp => {
      const userId = parseInt(req.query.id, 10)
      blockedModel.displayBlockedUsers(userId).then(blockedResult => {
        const blockedUser = blockedResult.rows.map(elem => elem.id)
        let searchResult = resp.rows
        if (blockedUser.length) {
          searchResult = resp.rows.filter(
            elem => !blockedUser.includes(elem.id)
          )
        }
        res.json(searchResult)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('something went wrong')
    })
}

module.exports = {
  searchProfils
}
