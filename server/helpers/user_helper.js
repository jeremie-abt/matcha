const user_model = require('../model/users_model')
const shared_model = require('../model/shared_model')

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
const check_request_validity = async (user_id, target_id, table_name) => {
  let is_request_valid = false
  let already_exist = null

  is_request_valid =
    await check_users_validity([user_id, target_id])
  already_exist =
    await shared_model.check_relation(user_id, target_id, table_name)
  return is_request_valid && already_exist && !already_exist.rowCount  
}

module.exports = {
  check_users_validity,
  check_request_validity
}
