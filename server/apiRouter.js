const express = require('express')
const multer = require('multer')

const uploadFile = require('./helpers/upload')
const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const matchsController = require('./controller/matchController')
const messagesController = require('./controller/messagesController')
const blockedController = require('./controller/blockedController')
const geolocController = require('./controller/geolocController')
const reportsController = require('./controller/reportsController')
const notificationsController = require('./controller/notificationsController')
const SearchController = require('./controller/SearchController')

// middleware
const dataVerifToken = require('./middleware/verifyToken')

const apiRouter = express.Router()

// set multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'img/')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

apiRouter.post('/upload', upload.single('file'), uploadFile.add)
// multer

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

/**
 * Pourquoi on est des routes type
 * .delete(/images/delete) ???
 * -> le but c'etait pas plutot de faire
 * .delete(/images) ???
 */

// Images routes
apiRouter.get('/:userId/images', imagesController.index)
apiRouter.put('/images/update', imagesController.update)
apiRouter.post('/images/add', imagesController.add)
apiRouter.delete('/images/delete', imagesController.del)

// Tags routes
apiRouter.get('/tags/all', tagsController.index)
apiRouter.get('/tags/:tagId', tagsController.show)
apiRouter.get('/tags/user/:userId', tagsController.userTags)

// Seen routes
apiRouter.get('/seen/:userId', seenController.index)

// likes routes
apiRouter.get('/like/:userId', likesController.index)
apiRouter.get('/like/getLiked/:userId', likesController.getLiked)
apiRouter.post('/like/add', likesController.add)
apiRouter.delete('/like/delete', likesController.del)

// Blocked routes
apiRouter.get('/blocked/:userId', blockedController.index)
apiRouter.post('/blocked/add', blockedController.add)
apiRouter.delete('/blocked/delete', blockedController.del)

// Reports routes
apiRouter.post('/reports/add', reportsController.add)

// Auth
apiRouter.get('/auth/confirmationMail/:token', usersController.confirmationMail)
apiRouter.get('/auth/verifyMail/:userId', usersController.verifyMail)

// jai mis post car get ne me semblait pas logique
apiRouter.post('/auth/sendTokenMail', usersController.sendTokenMail)

// Notifications
apiRouter.get('/notifications/:receiverId', notificationsController.index)
apiRouter.post('/notifications/add', notificationsController.add)
apiRouter.put('/notifications/update', notificationsController.update)

// match
apiRouter.get('/match/:userId', matchsController.index)
apiRouter.post('/match', matchsController.add)
apiRouter.delete('/match', matchsController.del)

// messages
apiRouter.get('/messages/:roomId', messagesController.index)
apiRouter.post('/messages', messagesController.add)
// Geoloc routes
apiRouter.get('/geoloc/:userId', geolocController.show)
apiRouter.post('/geoloc/add', geolocController.add)

// pour l'instant c'est hardcoder
module.exports = apiRouter
