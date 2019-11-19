const client = require('../database/connection')
const reqFormatter = require('../database/matchaRequestFormatter')

function searchProfils(userInfos) {
  const ReqFormatter = new reqFormatter()
  ReqFormatter.table = 'users'
  ReqFormatter.where({
    and: {
      ne: {
        id: userInfos.id
      },
      eq: {
        gender: userInfos.sexual_orientation
      }
    }
  })

  const ret = ReqFormatter.generateQuery('select')
  return client.query(...ret)
}

module.exports = {
  searchProfils
}
