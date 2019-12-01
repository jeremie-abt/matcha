import io from 'socket.io-client'

const socketUrl = 'http://localhost:8081'
const socket = io.connect(socketUrl)

const setSocket = id => {
  socket.emit('join', id) // rejoindre un socket ???

  socket.on('message received', () => {
    console.log("Hop vous avez un nouveaux message")
  })
  // example que je garde sous la main, mais on s'en fou un peu
  /*socket.on('notifReceived', msg => {
    console.log('msg: ', msg)
    // edit later for real notifications
  })*/
  return socket
}

export default setSocket
