const express = require('express')
const cors = require('cors')

//const app = express()
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const apiRouter = require('./apiRouter')

app.use(cookieParser())
app.use(express.static('./img'))

app.use(
  cors({
    origin: 'http://localhost:3000*',
    credentials: true
  })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', apiRouter)


//require('./socket/socketManager')
server.listen(8081)

io.on('connection', socket => {

  io.on('prout', () => {
    console.log('waa ca pue')
  })
  console.log("yo a tous")
  /*socket.on("testMessage", (test) =>  {
    console.log("received messages : ", test)
  })

  socket.on('join', id => {
    socket.join(`room${id}`)
  })

  socket.on('test', () => {
    console.log("coucou")
    /*console.log("vous avez recu un message, quelqun veut vous sucer", id_to_send)
    io.to(`room${idToSend}`).emit('message received')*//*
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('notifSent', ({ userData, userId, receiverId, type }) => {
    notificationsModel
      .createNotification(userId, receiverId, type)
      .then(result => {
        if (result.rowCount) {
          console.log('Notification created')
          io.to(`room${receiverId}`).emit(
            'notifReceived',
            notifContent.msg(userData, type)
          )
        } else {
          console.log('Error during creation')
        }
      })
      .catch(err => {
        throw err
      })
  })*/
})


module.exports.io = io
