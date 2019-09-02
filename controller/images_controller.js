const image_model = require('../model/images_model')

const show = (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  if (!user_id) {
    res.status(400).send('manque un params')
    res.end()
  }

  image_model.get_images_from_user_id(user_id)
    .then(response => {
      if (!response.rows.length) {
        res.status(404).send("boloosssss")
        return
      }
      else 
        res.render('images/index', { url: response.rows[0].url })
    })
    .catch(e => { throw e })
    // need front here
}

const update = (req, res) => {
  // check value params
  if (!req.body['image_id'] || !req.body['position']) {
    res.status(400).send('A params is missing')
    res.end()
  }

  const img_id = parseInt(req.body['image_id'])
  const position = parseInt(req.body['position'])
  if (position < 1 || position > 5) {
    res.status(400).send('minimum 1 image, max 5')
    res.end()
  }
  if (!img_id || !position) {
    res.status(400).send('value must be positive')
    res.end()
  }
  image_model.update_image_position(position, img_id)
    .catch(err => res.status(404).send(err))
    .then(result => {
      if (result.rowCount)
        res.status(200).send('updated ma man')
      else {
        throw 'error during update'
      }
    })
    .catch(err => res.status(404).send(err))
    .finally(() => res.end())
}

const del = (req, res) => {
  if (!req.body['user_id'] || !req.body['image_id']) {
    res.status(400).send('A params is missing')
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
        res.status(200).send('It was destroyed')
      }
      else {
        throw 'image not found'
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
    res.status(400).send('bad arguments')
    return
  }
  const user_images =
    await image_model.check_user_nb_images(user_id)
  if (user_images.rows.length >= 5) {
    res.status(403).send('maximum number of images reached, pls delete one')
    return
  }
  image_model.add_image(user_id, position, url)
    .catch(err => { throw err })
    .then(result => {
      if (result.rowCount) res.status(200).send('ok')
      else throw 'error during image upload'
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
