import io from 'socket.io-client'

const socketUrl = 'http://localhost:8081'
const socket = io.connect(socketUrl)

// Ici on definit l'interface pour les .on
const setSocket = id => {
  // only one emit used here cause I didn't find how to send args in connection event
  socket.emit('join', id)

  socket.on('message received', msg => {
    alert('Hop vous avez un nouveaux message : ', msg)
  })

  socket.on('notifReceived', msg => {
    alert(msg)
  })

  // example que je garde sous la main, mais on s'en fou un peu
  /*socket.on('notifReceived', msg => {
    console.log('msg: ', msg)
    // edit later for real notifications
  })*/
  return socket
}

export default setSocket
