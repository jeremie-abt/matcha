const userModel = require("../model/usersModel")

const userExist = (req, res, next) => {

  const userId = parseInt(req.params.userId, 10)
  userModel.isUserExisting(userId)
    .catch(() => {
      res.status(500).send("something Got wrong")
    })
    .then(resp => {
      if (resp.rowCount <= 0) {
        res.status(400).send("param missing or bad value")
        res.end()
        return
      }
      req.params.userId = userId
      next()
    })
}

module.exports = {
  userExist
}
