// eslint-disable-next-line import/order
const app = require('../server')

const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(8000, () => {
  // console.log('server is listening')
})

const notificationsModel = require('../model/notificationsModel')
const notifContent = require('../socket/notificationsContent')

io.on('connection', socket => {
  // console.log('User connected')
  socket.on('join', id => {
    socket.join(`room${id}`)
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
  })
})
