const geolocModel = require('../model/geolocModel')
const usersModel = require('../model/usersModel')

const show = async (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  const isExisting = userId
    ? await usersModel.isUserExisting(['id', userId])
    : false
  if (!isExisting.rowCount) {
    res.status(400).send('A param is missing or bad value')
    res.end()
    // eslint-disable-next-line no-useless-return
    return
  }
  try {
    const geoloc = await geolocModel.getGeoloc(userId)
    if (!geoloc.rowCount) res.status(204).send('no geoloc found')
    else res.json(geoloc.rows[0])
    res.end()
  } catch (err) {
    res.status(500).send(err)
  }
}

const add = (req, res) => {
  const { lat, long } = req.body
  const userId = parseInt(req.body.userId, 10)

  geolocModel
    .addGeoloc(userId, lat, long)
    .catch(err => {
      throw err
    })
    .finally(() => res.end())
}

module.exports = {
  show,
  add
}
