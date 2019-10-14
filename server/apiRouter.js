const express = require('express')
const multer = require('multer')
const path = require('path')

const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const blockedController = require('./controller/blockedController')
const notificationsController = require('./controller/notificationsController')

// middleware
const dataVerifToken = require('./middleware/verifyToken')
// handle multi-format type data

const apiRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
apiRouter.get(
  '/users/getUser',
  dataVerifToken.verifyToken,
  usersController.show
)
apiRouter.post('/users', usersController.create)
apiRouter.put('/users/:userId', usersController.update)
apiRouter.delete('/users/:userId/delete', usersController.del)
apiRouter.post('/users/authenticate', usersController.ManageAuthentification)

// Images routes
apiRouter.get('/:userId/images', imagesController.index)
apiRouter.put('/images/update', imagesController.update)
apiRouter.post('/images/add', upload.single('myImage'), imagesController.add)
apiRouter.delete('/images/delete', imagesController.del)

// Tags routes
apiRouter.get('/tags/all', tagsController.index)
apiRouter.get('/tags/:tagId', tagsController.show)

// Seen routes
apiRouter.get('/seen/:userId', seenController.index)

// Likes routes
apiRouter.get('/likes/:userId', likesController.index)
apiRouter.post('/likes/add', likesController.add)
apiRouter.delete('/likes/delete', likesController.del)

// Blocked routes
apiRouter.get('/blocked/:userId', blockedController.index)
apiRouter.post('/blocked/add', blockedController.add)
apiRouter.delete('/blocked/delete', blockedController.del)

// Auth
apiRouter.get('/auth/confirmationMail/:token', usersController.confirmationMail)

// Notifications
apiRouter.get('/notifications/:receiverId', notificationsController.index)
apiRouter.post('/notifications/add', notificationsController.add)
apiRouter.put('/notifications/update', notificationsController.update)

// pour l'instant c'est hardcoder
module.exports = apiRouter
