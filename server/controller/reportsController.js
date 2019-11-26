const reportsModel = require('../model/reportsModel')
const blockedModel = require('../model/blockedModel')
const usersModel = require('../model/usersModel')

const add = (req, res) => {
  const userId = parseInt(req.body.userId, 10)
  const reportedId = parseInt(req.body.reportedId, 10)

  blockedModel.addUserBlocked(userId, reportedId)
  reportsModel
    .addReportedUser(userId, reportedId)
    .catch(err => {
      throw err
    })
    .then(async () => {
      const query = await reportsModel.countReports(reportedId)
      const nbReports = parseInt(query.rows[0].count, 10)
      if (nbReports === 10) {
        // prevoir mail sayin 'you've been reported ad judge harmful for the community'
        // 'so your account has been be deleted'
        usersModel.deleteUser(reportedId)
      }
    })
    .catch(err => {
      throw err
    })
    .finally(() => res.end())
}

module.exports = {
  add
}
