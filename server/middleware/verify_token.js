const jwt = require('jsonwebtoken')

const signing_key = require("../secret/jwt_secret_key").signing_key

function verify_token(req, res, next) {
 
  if (!("authorization" in req.headers)) {
    res.status(404).send("token not given")
    return
  }
  token_tab = req.headers.authorization.split(" ")
  if (token_tab[0] !== "Bearer") {
    res.status(403).send("Bad token")
    return
  }
  try {
    let ret = jwt.verify(token_tab[1], signing_key)
  }
  catch (err) {
    res.status(403).send("Bad token")
    return 
  }
  next()
}

module.exports = {
  verify_token
}