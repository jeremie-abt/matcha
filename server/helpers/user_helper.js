const user_model = require('../model/users_model')

const check_users_validity = (ids) => {
  let p_check_validity_ids = []

  p_check_validity_ids =  ids.map(id => {
    return user_model.is_user_existing(id)
  })
  return Promise.all(p_check_validity_ids)
}

module.exports = {
  check_users_validity
}
