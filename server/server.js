const express = require('express')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())
const apiRouter = require('./apiRouter')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api', apiRouter)

server.listen(8000, () => {
  console.log('server is listening')
})
app.listen(8081)

module.exports.io = io
const socketManager = require('./socket/socketManager')

io.on('connection', socketManager)
