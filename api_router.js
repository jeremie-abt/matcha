const express = require("express")
const users_controller = require("./controller/users_controller")
const images_controller = require("./controller/images_controller")

let api_router = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

// user routes
//bad name -> index should be show
api_router.get("/users/:user_id", users_controller.index)

//images routes
api_router.get("/:user_id/images", images_controller.show)

// pour l'instant c'est hardcoder
module.exports.api_router = api_router
