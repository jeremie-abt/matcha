const express = require('express')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const apiRouter = require('./apiRouter')

app.use(cookieParser())
app.use(express.static('./img'))

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', apiRouter)

app.listen(8081)

// eslint-disable-next-line no-unused-vars
const socketManager = require('./socket/socketManager')

module.exports.app = app
