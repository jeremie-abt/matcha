/* eslint-disable no-console */
const usersModel = require('../model/usersModel')
const sharedModel = require('../model/sharedModel')

const checkUsersValidity = async ids => {
  let pCheckValidityIds = []
  let isValid = true

  pCheckValidityIds = ids.map(id => usersModel.is_user_existing(id))
  await Promise.all(pCheckValidityIds)
    .then(resp => {
      resp.forEach(queryResp => {
        if (queryResp.rowCount <= 0) isValid = false
      })
    })
    .catch(err => {
      console.log('One of the promises failed', err)
      return err
    })
  return isValid
}
const checkRequestValidity = async (userId, targetId, tableName) => {
  let isRequestValid = false
  let alreadyExist = null

  isRequestValid = await checkUsersValidity([userId, targetId])
  alreadyExist = await sharedModel.check_relation(userId, targetId, tableName)
  return isRequestValid && alreadyExist && !alreadyExist.rowCount
}

module.exports = {
  checkUsersValidity,
  checkRequestValidity
}
