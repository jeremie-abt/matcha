const user_model = require('../model/users_model')

const check_user_validity = async (id) => {
  if (!id) return false
  const response = await user_model.is_user_existing(id)
  return !!response.rowCount
}

module.exports = {
  check_user_validity
}