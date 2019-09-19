const user_model = require("../model/users_model")

const user_exist = (req, res, next) => {
  const user_id = parseInt(req.params["user_id"])
  const is_existing = user_model.is_user_existing(user_id)
    .catch(err => {
      res.status(500).send("something Got wrong")
    })
    .then(resp => {
      if (resp.rowCount <= 0) {
        res.status(400).send("param missing or bad value")
        res.end()
        return
      }
      req.params.user_id = user_id
      next()
    })
}

module.exports = {
  user_exist
}
