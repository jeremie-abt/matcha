const blocked_model = require('../model/blocked_model')
const users_model = require('../model/users_model')
const user_helper = require('../helpers/user_helper')

const index = async (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  const is_existing = user_id
    ? await users_model.is_user_existing(user_id)
    : false
  if (!is_existing.rowCount) {
    res
      .status(400)
      .send('A param is missing or bad value')
    res.end()
    return
  }
  blocked_model.display_blocked_users(user_id)
    .catch(err => {
      throw [500, 'Request failed']
    })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No blocked user found"]
      res.json(result.rows)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
  }

const add = async (req, res) => {
  const user_id = parseInt(req.body['user_id'])
  const blocked_id = parseInt(req.body['blocked_id'])
  let is_valid = false

  if (user_id && blocked_id)
    is_valid = await user_helper.check_request_validity(user_id, blocked_id, 'blocked')
  if (!is_valid) {
    res
      .status(400)
      .send('A param is missing or bad value or already exist')
    res.end()
    return
  }
  blocked_model.add_user_blocked(user_id, blocked_id)
    .catch( err => { throw [500, 'Request failed'] })
    .then(result => {
      if (result.rowCount) res.status(200)
      else throw [400, 'Error during add']
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1])
    })
    .finally(() => res.end())
}

const del = async (req, res) => {
  const user_id = parseInt(req.body['user_id'])
  const blocked_id = parseInt(req.body['blocked_id'])
  let is_valid = false

  if (user_id && blocked_id)
    is_valid = await user_helper.check_users_validity([user_id, blocked_id])
  if (!is_valid) {
    res
      .status(400)
      .send('A param is missing or bad value')
    res.end()
    return
  }
  blocked_model.delete_blocked(user_id, blocked_id)
    .catch(err => { 
      throw [ 500, "Request failed" ]
    })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No blocked user found"]
      else res.status(200)
    })
    .catch(err => {
      res.status(err[0])
      res.write(err[1]) 
    })
    .finally(() => res.end())
}

module.exports = {
  index,
  add,
  del
}
