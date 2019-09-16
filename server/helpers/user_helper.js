const user_model = require('../model/users_model')

const check_users_validity = async (ids) => {
  let p_check_validity_ids = []
  let is_valid = true

  p_check_validity_ids =  ids.map(id => {
    return user_model.is_user_existing(id)
  })
  await Promise.all(p_check_validity_ids)
    .then(resp => {
      resp.forEach(query_resp => {
        if (query_resp.rowCount <= 0)
          is_valid = false
      })
    })
    .catch(err => {
      console.log('One of the promises failed', err)
      return err
    })
  return is_valid
}

module.exports = {
  check_users_validity
}
