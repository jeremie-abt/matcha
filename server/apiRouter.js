const express = require('express')

const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const blockedController = require('./controller/blockedController')
const notificationsController = require('./controller/notificationsController')
const SearchController = require('./controller/SearchController')

// middleware
const dataVerifToken = require('./middleware/verifyToken')

const apiRouter = express.Router()

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
// e.preventDefault()
apiRouter.delete('/users/:userId/delete', usersController.del)
apiRouter.post('/users/authenticate', usersController.ManageAuthentification)
apiRouter.post(
  '/users/updatePassword',
  dataVerifToken.verifyToken,
  usersController.updatePassword
)

// search
apiRouter.get(
  '/search',
  dataVerifToken.verifyToken,
  SearchController.searchProfils
)

// Images routes
apiRouter.get('/:user_id/images', imagesController.show)
apiRouter.put('/images/update', imagesController.update)
apiRouter.post('/images/add', imagesController.add)
apiRouter.delete('/images/delete', imagesController.del)

// Tags routes
apiRouter.get('/tags/all', tagsController.index)
apiRouter.get('/tags/:tagId', tagsController.show)

// Seen routes
apiRouter.get('/seen/:userId', seenController.index)

// likes routes
apiRouter.get('/like/:userId', likesController.index)
apiRouter.post('/like/add', likesController.add)
apiRouter.delete('/like/delete', likesController.del)

// Blocked routes
apiRouter.get('/blocked/:userId', blockedController.index)
apiRouter.post('/blocked/add', blockedController.add)
apiRouter.delete('/blocked/delete', blockedController.del)

// Auth
apiRouter.get('/auth/confirmationMail/:token', usersController.confirmationMail)
apiRouter.get('/auth/verifyMail/:userId', usersController.verifyMail)

// jai mis post car get ne me semblait pas logique
apiRouter.post('/auth/sendTokenMail', usersController.sendTokenMail)

// Notifications
apiRouter.get('/notifications/:receiverId', notificationsController.index)
apiRouter.post('/notifications/add', notificationsController.add)
apiRouter.put('/notifications/update', notificationsController.update)

// pour l'instant c'est hardcoder
module.exports = apiRouter
