// eslint-disable-next-line import/order
//const io = require('../server')
/*
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingTimeout: 6000
})*/

//server.listen(8081)

// const notificationsModel = require('../model/notificationsModel')
// const notifContent = require('../socket/notificationsContent')

// io.on('connection', socket => {

//   console.log("yo a tous")
//   socket.on("testMessage", (test) =>  {
//     console.log("received messages : ", test)
//   })

//   socket.on('join', id => {
//     socket.join(`room${id}`)
//   })

//   socket.on('test', () => {
//     console.log("coucou")
//     /*console.log("vous avez recu un message, quelqun veut vous sucer", id_to_send)
//     io.to(`room${idToSend}`).emit('message received')*/
//   })

//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })

//   socket.on('notifSent', ({ userData, userId, receiverId, type }) => {
//     notificationsModel
//       .createNotification(userId, receiverId, type)
//       .then(result => {
//         if (result.rowCount) {
//           console.log('Notification created')
//           io.to(`room${receiverId}`).emit(
//             'notifReceived',
//             notifContent.msg(userData, type)
//           )
//         } else {
//           console.log('Error during creation')
//         }
//       })
//       .catch(err => {
//         throw err
//       })
//   })
// })
