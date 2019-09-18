const users_model = require('../model/users_model')
const likes_model = require('../model/likes_model')
const user_helper = require('../helpers/user_helper')

const index = async (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  let is_existing = user_id
    ? await users_model.is_user_existing(user_id)
    : false

  if (!user_id || user_id < 0 || !is_existing.rowCount) {
    res
      .status(400)
      .send('A param is missing or bad value')
    res.end()
    return
  }
  likes_model.display_users_liked(user_id)
    .catch(err => { 
      throw [ 500, "Request failed" ]
    })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No like found"]
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
  const likes_id = parseInt(req.body['likes_id'])
  let is_valid = false

  if (user_id && likes_id)
    is_valid = await user_helper.check_request_validity(user_id, likes_id, 'likes')
  if (!is_valid) {
    res
      .status(400)
      .send('A param is missing or bad value or already exist')
    res.end()
    return
  }

  likes_model
    .add_user_liked(user_id, likes_id)
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
  const likes_id = parseInt(req.body['likes_id'])
  let is_valid = false

  if (user_id && likes_id)
    is_valid = await user_helper.check_users_validity([user_id, likes_id])
  if (!is_valid) {
    res
      .status(400)
      .send('A param is missing or bad value')
    res.end()
    return
  }
  likes_model.delete_like(user_id, likes_id)
    .catch(err => { 
      throw [ 500, "Request failed" ]
    })
    .then(result => {
      if (!result.rowCount)
        throw [204, "No like found"]
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
