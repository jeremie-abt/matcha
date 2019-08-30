const express = require("express")
const users_controller = require("./controller/users_controller")

let api_router = express.Router()

// require of controller

// faire un loader de tous mes controller

// code de creation de router

api_router.get("/users/:user_id", users_controller.show)
api_router.post("/users", users_controller.create)


// pour l'instant c'est hardcoder
module.exports = api_router
