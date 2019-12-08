const express = require('express')
const cors = require('cors')

// const app = express()
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const apiRouter = require('./apiRouter')

const notificationsModel = require('./model/notificationsModel')
const manageNotif = require('./socket/notificationsContent')

const onlineModel = require('./model/onlineModel')

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

function createNotifDb({ userId, receiverId, type }) {
  notificationsModel.createNotification(userId, receiverId, type).catch(err => {
    throw err
  })
}

// require('./socket/socketManager')
server.listen(8081)

const userDeconnection = (userId) => {
  if (userId) {
    onlineModel.userDisconnection(userId)
    .catch(e => {
      console.log("err : ", e)
    })
  }
  
}

io.on('connection', socket => {
  socket.on('join', id => {
    // insertion 
    onlineModel.userConnection(id)
    .then(() => {
      socket.userId = id
    })
    .catch((e) => {
      console.log("fail : ", e)
    })
    socket.join(`room${id}`)
  })

  socket.on('handleDisconnection', (userId) => {
    userDeconnection(userId)
  })

  socket.on('disconnect', () => {
    userDeconnection(socket.userId)
  })
  
  /*
  socket.on('like', async infos => {
    try {
      await createNotifDb(infos)
      manageNotif(socket, infos)
    } catch {
      // comment on gere cette erreur ???
    }
  })

  socket.on('unlike', async infos => {
    conosle
    manageNotif(socket, infos)
  })
*/

// quand tu unlike quelqun -> enlever la notif like
// quand tu unmatch quelqun enlever la notif match

  socket.on('notifSent', ({ userId, receiverId, type }) => {
    // bon ca c'est tres clairement shlag
    if (type === 'unmatch') {
      notificationsModel
        .deleteNotification(userId, receiverId, 'match')
        .then(() => {
          return notificationsModel
            .deleteNotification(receiverId, userId, 'match')
          })
        .then(() => {
            manageNotif(io, {userId, receiverId, type: 'unmatch'})
        })
    }
    if (type === 'unlike' || type === 'unmatch') {
      notificationsModel.
        deleteNotification(userId, receiverId, 'like')
        .then(() => {
          manageNotif(io, { userId, receiverId, type: 'unlike' })
        })
        .catch((e) => {
          console.log("error, can't suppress notif : e", e)
        })
    } else {
      notificationsModel
        .createNotification(userId, receiverId, type === "seen" ? "view" : type)
        .then(result => {
          if (result.rowCount) {
            manageNotif(io, { userId, receiverId, type })
          }
        })
        .catch(err => {
          throw err
        })
    }
  })

  /*socket.on('seen', (idToSend) => {
    socket.to(`room${idToSend}`).emit('seenReceived')
  })*/

  socket.on('messageSent', (idToSend, msgMetadata) => {
    socket.to(`room${idToSend}`).emit('messageReceived', msgMetadata)
  })
})

module.exports.io = io
