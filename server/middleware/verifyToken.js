const jwt = require('jsonwebtoken');
const key = require('../config/jwtSecretKey');

function verifyToken(req, res, next) {
  
  if (!('authorization' in req.headers)) {
    res.status(404).send('token not given');
    return;
  }
  
  const tokenTab = req.headers.authorization.split(' ');
  if (tokenTab[0] !== 'Bearer') {
    res.status(401).send('Bad token');
    return;
  }
  try {
    req.tokenInfo = jwt.verify(tokenTab[1], key);
  } catch (err) {
    res.status(401).send('Bad token');
    return;
  }
  next();
}

module.exports = {
  verifyToken,
};
