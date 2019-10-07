const express = require('express')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(cors())
const apiRouter = require('./apiRouter')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api', apiRouter)

app.listen(8081)
