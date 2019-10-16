const express = require('express')
<<<<<<< Updated upstream
const multer = require('multer')
const path = require('path')
=======
<<<<<<< Updated upstream
=======
const multer = require('multer')
>>>>>>> Stashed changes
>>>>>>> Stashed changes

const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const blockedController = require('./controller/blockedController')
const notificationsController = require('./controller/notificationsController')

// middleware
const dataVerifToken = require('./middleware/verifyToken')
<<<<<<< HEAD
// handle multi-format type data
=======
>>>>>>> 51269fd6fd36f894a5800e72bfb6d49b2cbcf2d9

const apiRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

// multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/upload')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage }).single('file')

apiRouter.post('/upload', (req, res) => {
  // eslint-disable-next-line func-names
  console.log(req.file)
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return res.status(500).json(err)
    }
    if (err) {
      console.log(err)
      return res.status(500).json(err)
    }
    console.log(req.file)
    return res.status(200).send(req.file)
  })
})
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
