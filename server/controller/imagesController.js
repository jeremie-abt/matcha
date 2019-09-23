const imageModel = require('../model/imagesModel')

const show = (req, res) => {
  const userId = parseInt(req.params.userId, 10)
  if (!userId) {
    res.status(400).send('User not found')
    res.end()
    return
  }

  imageModel
    .getImagesFromUserId(userId)
    .then(response => {
      if (!response.rows.length) {
        res.status(404).send('No images found')
        return
      }
      const { url } = response.rows[0]
      res.json({ url })
    })
    .catch(e => {
      throw e
    })
    .finally(() => res.end())
  // need front here
}

const update = (req, res) => {
  // check value params
  if (!req.body.imageId || !req.body.position) {
    res.status(400).send('A param is missing')
    res.end()
    return
  }

  const imgId = parseInt(req.body.imageId, 10)
  const position = parseInt(req.body.position, 10)
  if (position < 1 || position > 5) {
    res.status(400).send('Minimum 1 image, max 5')
    res.end()
    return
  }
  if (!imgId || !position) {
    res.status(400).send('Value must be positive')
    res.end()
  }
  imageModel
    .updateImagePosition(position, imgId)
    .catch(err => res.status(404).send(err))
    .then(result => {
      if (result.rowCount) res.status(200).send('Image updated')
      else {
        throw 'Error during update'
      }
    })
    .catch(err => res.status(404).send(err))
    .finally(() => res.end())
}

const del = (req, res) => {
  if (!req.body.userId || !req.body.imageId) {
    res.status(400).send('A param is missing')
    return
  }
  // parseInt = atoi (just to be safe)
  const imageId = parseInt(req.body.imageId, 10)
  const userId = parseInt(req.body.userId, 10)
  if (!imageId || !userId || imageId < 0 || userId < 0) {
    res.status(404).send('Need a valid int')
    res.end()
    return
  }
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
  // change render and 'then'
}

const add = async (req, res) => {
  let { userId, position } = req.body
  const { url } = req.body
  userId = parseInt(userId, 10)
  position = parseInt(position, 10)
  if (!userId && position < 1 && position > 5 && !url) {
    res.status(400).send('Bad params value')
    return
  }
  const userImages = await imageModel.checkUserNbImages(userId)
  if (userImages.rows.length >= 5) {
    res.status(403).send('Maximum number of images reached, pls delete one')
    return
  }
  imageModel
    .addImage(userId, position, url)
    .catch(err => {
      throw err
    })
    .then(result => {
      if (result.rowCount) res.status(200).send('ok')
      else throw 'Error during image upload'
    })
    .catch(err => res.status(404).sned(err))
    .finally(() => res.end())
}

module.exports = {
  show,
  del,
  update,
  add
}
