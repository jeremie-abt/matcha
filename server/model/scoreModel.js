const client = require('../database/connection')

const updateScore = (type, userId) => {
  let updatePercentage
  if (type === 'seen') updatePercentage = 0.002
  else if (type === 'like') updatePercentage = 0.02
  else throw 'unrecognized type for updating score'
  
  const statement = 'UPDATE users SET ' +
      ' popularity_score = (popularity_score + ' +
      ` (popularity_score * ${updatePercentage}))` + 
      ` WHERE id = $1 AND popularity_score < 99`
  return client.query(statement, [userId])
}

module.exports = {
    updateScore
}
