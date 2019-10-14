import socket from '../index'

const setSocket = id => {
  socket.emit('join', id)

  socket.on('notifReceived', msg => {
    console.log('msg:', msg)
    // edit later for real notifications
  })
}

export default setSocket
