const imageModel = require('../model/imagesModel')
const deleteFile = require('../helpers/deleteFile')

const index = (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  if (!userId) {
    res.status(400).send('User not found')
    res.end()
    return
  }

  imageModel
    .getImagesFromUserId(userId)
    .then(response => {
      const { rows } = response
      res.json(rows)
    })
    .catch(e => {
      throw e
    })
    .finally(() => res.end())
}

const update = async (req, res) => {
  if (!req.body.imageId || !req.body.userId) {
    res.status(400).send('A param is missing')
    res.end()
    return
  }

  const imgId = parseInt(req.body.imageId, 10)
  const userId = parseInt(req.body.userId, 10)
  if (!imgId) {
    res.status(400).send('Value must be positive')
    res.end()
  }
  let currentProfilImage = null
  await imageModel
    .getProfilImage(userId)
    .then(result => {
      if (result.rowCount) currentProfilImage = result.rows[0].id
    })
    .catch(err => {
      throw err
    })
  if (!(currentProfilImage === imgId)) {
    imageModel
      .updateImage(imgId, true)
      .catch(err => res.status(404).send(err))
      .then(result => {
        if (result.rowCount) {
          imageModel.updateImage(currentProfilImage, false)
          res.status(200).send('Image updated')
        } else {
          throw 'Error during update'
        }
      })
      .catch(err => res.status(404).send(err))
      .finally(() => res.end())
  }
}

const del = (req, res) => {
  if (!req.body.userId || !req.body.imageId) {
    res.status(400).send('A param is missing')
    return
  }
  const imageId = parseInt(req.body.imageId, 10)
  const userId = parseInt(req.body.userId, 10)
  const { url } = req.body

  if (!imageId || !userId || imageId < 0 || userId < 0) {
    res.status(404).send('Need a valid int')
    res.end()
    return
  }
  deleteFile.deleteImage(url)
  imageModel
    .deleteUserImage(imageId, userId)
    .catch(err => {
      throw err
    })
    .then(response => {
      if (response.rowCount) {
        res.status(200).send('Image destroyed')
      } else {
        throw 'Image not found'
      }
    })
    .catch(err => res.satus(404).send(err))
    .finally(() => res.end())
}

const add = async (req, res) => {
  let { userId } = req.body
  const { url } = req.body

  userId = parseInt(userId, 10)
  if (!userId && !url) {
    res.status(400).send('Bad params value')
    return
  }
  const userImages = await imageModel.checkUserNbImages(userId)
  if (userImages.rows.length >= 5) {
    res.status(403).send('Maximum number of images reached, pls delete one')
    return
  }
  imageModel
    .addImage(userId, url)
    .catch(err => {
      throw err
    })
    .then(result => {
      if (result.rowCount) res.json(result.rows[0])
      else throw 'Error during image upload'
    })
    .catch(err => res.status(404).send(err))
    .finally(() => res.end())
}

module.exports = {
  index,
  del,
  update,
  add
}
