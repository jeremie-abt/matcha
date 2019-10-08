const jwt = require("jsonwebtoken")
const key = require("../config/jwtSecretKey")


// Oui c'est pas un controller mais je vais pas creer
// un controller pour ca vu qu'il n'y a qunune
// toute petite logique derriere et pas de model
function createToken(id) {

  const token = jwt.sign({
    isAuth: true,
    "id": id
  }, key)
  return token
}


module.exports = {
  createToken
}
