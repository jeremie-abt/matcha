const image_model = require('../model/images_model')

const show = (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  if (!user_id) {
    res.status(400).send('User not found')
    res.end()
  }

  image_model.get_images_from_user_id(user_id)
    .then(response => {
      if (!response.rows.length) {
        res.status(404).send('No images found')
        return
      }
      else {
        const url = response.rows[0].url
        res.json({ url: url })
      }
    })
    .catch(e => { throw e })
    .finally(() => res.end())
    // need front here
}

const update = (req, res) => {
  // check value params
  if (!req.body['image_id'] || !req.body['position']) {
    res.status(400).send('A param is missing')
    res.end()
  }

  const img_id = parseInt(req.body['image_id'])
  const position = parseInt(req.body['position'])
  if (position < 1 || position > 5) {
    res.status(400).send('Minimum 1 image, max 5')
    res.end()
  }
  if (!img_id || !position) {
    res.status(400).send('Value must be positive')
    res.end()
  }
  image_model.update_image_position(position, img_id)
    .catch(err => res.status(404).send(err))
    .then(result => {
      if (result.rowCount)
        res.status(200).send('Image updated')
      else {
        throw 'Error during update'
      }
    })
    .catch(err => res.status(404).send(err))
    .finally(() => res.end())
}

const del = (req, res) => {
  if (!req.body['user_id'] || !req.body['image_id']) {
    res.status(400).send('A param is missing')
    return
  }
  // parseInt = atoi (just to be safe)
  const image_id = parseInt(req.body['image_id'])
  const user_id = parseInt(req.body['user_id'])
  if (
    !image_id ||
    !user_id ||
    image_id < 0 ||
    user_id < 0
  ) {
    res.status(404).send('Need a valid int')
    res.end()
  }
  image_model.delete_user_image(image_id, user_id)
    .catch(err => { throw err })
    .then(response => {
      if (response.rowCount) {
        res.status(200).send('Image destroyed')
      }
      else {
        throw 'Image not found'
      }
    })
    .catch(err => res.satus(404).send(err))
    .finally(() => res.end())
    // change render and 'then'
}

const add = async (req, res) => {
  let { user_id, position, url } = req.body
  user_id = parseInt(user_id)
  position = parseInt(position)
  if (!user_id && position < 1 && position > 5 && !url) {
    res.status(400).send('Bad params value')
    return
  }
  const user_images =
    await image_model.check_user_nb_images(user_id)
  if (user_images.rows.length >= 5) {
    res.status(403).send('Maximum number of images reached, pls delete one')
    return
  }
  image_model.add_image(user_id, position, url)
    .catch(err => { throw err })
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
