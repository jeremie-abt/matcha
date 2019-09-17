const express = require("express")
const users_controller = require("./controller/users_controller")
const tags_controller = require("./controller/tags_controller")
const seen_controller = require("./controller/seen_controller")
const images_controller = require("./controller/images_controller")
const likes_controller = require("./controller/likes_controller")
const blocked_controller = require("./controller/blocked_controller")
const api_router = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
api_router.get("/users/:user_id", users_controller.show)
api_router.post("/users", users_controller.create)
api_router.put("/users/:user_id", users_controller.update)
api_router.delete("/users/:user_id/delete", users_controller.del)

//images routes
api_router.get('/:user_id/images', images_controller.show)
api_router.put('/images/update', images_controller.update)
api_router.post('/images/add', images_controller.add)
api_router.delete('/images/delete', images_controller.del)

//tags routes
api_router.get('/tags/all', tags_controller.index)
api_router.get('/tags/:tag_id', tags_controller.show)

//seen routes
api_router.get('/seen/:user_id', seen_controller.index)

//likes routes
api_router.get('/likes/:user_id', likes_controller.index)
api_router.post('/likes/add', likes_controller.add)
api_router.delete('/likes/delete', likes_controller.del)

//blocked routes
api_router.get('/blocked/:user_id', blocked_controller.index)
api_router.post('/blocked/add', blocked_controller.add)
api_router.delete('/blocked/delete', likes_controller.del)

// pour l'instant c'est hardcoder
module.exports = api_router
