const express = require('express')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// temporaire a voir comment faire des imports propres.
app.use(cors())
const apiRouter = require('./api_router')

// template engine
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', apiRouter)

// la je fais mes routes ici comme un gros sale mais bon
// va falloir penser apres a comment les faires

app.listen(8081)
