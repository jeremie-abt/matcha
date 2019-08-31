const express = require("express")
const app = express()
const bodyParser = require('body-parser')
// temporaire a voir comment faire des imports propres.

// a suppr c'est juste pour test
const test = require("./database/matcha_request_formatter")
formatter = new test()
formatter.where({
  and : {
    range : {
      user_id : [5, 29],
    },
    eq : {
      lastname : "fredo"
    }
  },
  or : {
    range : {
      user_id : [15,25] 
    }
  } 
})


//const api_router = require("./api_router")
//
//// template engine
//app.set('view engine', 'ejs')
//
//app.use(bodyParser.urlencoded({ extended: false }))
//
//app.use('/api', api_router)
//
//
//// la je fais mes routes ici comme un gros sale mais bon
//// va falloir penser apres a comment les faires
//
app.listen(8081)