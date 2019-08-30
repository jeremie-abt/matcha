const image_model = require('../model/images_model')

const show = (req, res) => {
  const user_id = parseInt(req.params['user_id'])
  if (!user_id) {
    res.status(400).send('manque un params')
    return
  }

  const req_promise = image_model.get_images_from_user_id(user_id)
  req_promise
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
  console.log(req.body)
  if (!req.body['image_id'] || !req.body['position'])
    res.status(400).send('manque un params')

  const img_id = parseInt(req.body['image_id'])
  const position = parseInt(req.body['position'])
  if (position < 1 || position > 5) {
    res.status(400).send('minimum 1 max 5')
    return
  }
  if (!img_id || !position) res.status(400).send('> 1 bitchies')
  image_model.update_image_position(position, img_id)
    .then(result => {
      if (result.rowCount)
        res.status(200).send('updated ma man')
      else {
        res.status(400).send('nop nop')
        return
      }
    })
    .catch(e => { throw e })
}

const del = (req, res) => {
  if (!req.body['user_id'] || !req.body['image_id']) {
    res.status(400).send('error bitch user_id ou image_id missing')
    return
  }
  // parseInt = atoi (just to be safe)
  const image_id = parseInt(req.body['image_id'])
  if (!image_id) return 'Not an int batard ou null'
  const user_id = parseInt(req.body['user_id'])

  image_model.delete_user_image(user_id, image_id)
    .then(response => {
      if (!response.rows.length) {
        res.status(404).send('bolossss')
        return
      }
      else 
        res.status(200).send('It was destroyed')
    })
    .catch(e => { throw e })
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
    res.status(403).send('maximum number of images reached')
    return
  }
  image_model.add_image(user_id, position, url)
    .then(result => {
      return
    })
    .catch(e => { throw e })
}

module.exports = {
  show,
  del,
  update,
  add
}
