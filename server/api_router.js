const express = require('express')
const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const blockedController = require('./controller/blockedController')

const apiRouter = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
apiRouter.get('/users/:user_id', usersController.show)
apiRouter.post('/users', usersController.create)
apiRouter.put('/users/:user_id', usersController.update)
apiRouter.delete('/users/:user_id/delete', usersController.del)

// images routes
apiRouter.get('/:user_id/images', imagesController.show)
apiRouter.put('/images/update', imagesController.update)
apiRouter.post('/images/add', imagesController.add)
apiRouter.delete('/images/delete', imagesController.del)

// tags routes
apiRouter.get('/tags/all', tagsController.index)
apiRouter.get('/tags/:tag_id', tagsController.show)

// seen routes
apiRouter.get('/seen/:user_id', seenController.index)

// likes routes
apiRouter.get('/likes/:user_id', likesController.index)
apiRouter.post('/likes/add', likesController.add)
apiRouter.delete('/likes/delete', likesController.del)

// blocked routes
apiRouter.get('/blocked/:user_id', blockedController.index)
apiRouter.post('/blocked/add', blockedController.add)
apiRouter.delete('/blocked/delete', blockedController.del)

// pour l'instant c'est hardcoder
module.exports = apiRouter
