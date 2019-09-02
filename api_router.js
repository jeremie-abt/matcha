const express = require("express")
const users_controller = require("./controller/users_controller")
const images_controller = require("./controller/images_controller")
let api_router = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
//bad name -> index should be show
api_router.get("/users/:user_id", users_controller.show)
api_router.post("/users", users_controller.create)
api_router.put("/users/:user_id", users_controller.update)
api_router.delete("/users/:user_id", users_controller.del)

//images routes
api_router.get('/:user_id/images', images_controller.show)
api_router.put('/images/update', images_controller.update)
api_router.post('/images/add', images_controller.add)
api_router.delete('/images', images_controller.del)

//images routes

// pour l'instant c'est hardcoder
module.exports = api_router