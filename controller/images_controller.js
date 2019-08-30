const user_model = require('../model/images_model')

const show = (req, res) => {
  if (!req.params['user_id']) throw 'error bitch user_id'
  const user_id = req.params['user_id']

  const req_promise = user_model.get_images_from_user_id(user_id)
  req_promise
    .then((response) => {
      if (!response.rows.length)
        res.status(404).send("boloosssss")
      else 
        res.render('images/index', { url: response.rows[0].url })
    })
    .catch(e => { throw e })
  // need front here
}

module.exports = {
  show
}
