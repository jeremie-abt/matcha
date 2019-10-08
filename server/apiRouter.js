const express = require("express")

const usersController = require('./controller/usersController')
const tagsController = require('./controller/tagsController')
const seenController = require('./controller/seenController')
const imagesController = require('./controller/imagesController')
const likesController = require('./controller/likesController')
const blockedController = require('./controller/blockedController')

// middleware
const dataVerifToken = require("./middleware/verifyToken")

const apiRouter = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
apiRouter.get('/users/getUser', dataVerifToken.verifyToken, usersController.show)
apiRouter.post('/users', usersController.create)
apiRouter.put('/users/:userId', usersController.update)
apiRouter.delete('/users/:userId/delete', usersController.del)
apiRouter.post('/users/authenticate', usersController.ManageAuthentification)

// images routes
apiRouter.get('/:user_id/images', imagesController.show)
apiRouter.put('/images/update', imagesController.update)
apiRouter.post('/images/add', imagesController.add)
apiRouter.delete('/images/delete', imagesController.del)

// tags routes
apiRouter.get('/tags/all', tagsController.index)
apiRouter.get('/tags/:tagId', tagsController.show)

// seen routes
apiRouter.get('/seen/:userId', seenController.index)

// likes routes
apiRouter.get('/like/:userId', likesController.index)
apiRouter.post('/like/add', likesController.add)
apiRouter.delete('/like/delete', likesController.del)

// blocked routes
apiRouter.get('/blocked/:userId', blockedController.index)
apiRouter.post('/blocked/add', blockedController.add)
apiRouter.delete('/blocked/delete', blockedController.del)

// Auth
apiRouter.get('/auth/confirmationMail/:token',
    usersController.confirmationMail)
// jai mis post car get ne me semblait pas logique
apiRouter.post('/auth/sendTokenMail',
    usersController.sendTokenMail)



// pour l'instant c'est hardcoder
module.exports = apiRouter
