import io from 'socket.io-client'

const socketUrl = 'http://localhost:8081'
const socket = io.connect(socketUrl)

// Ici on definit l'interface pour les .on
const setSocket = id => {
  // only one emit used here cause I didn't find how to send args in connection event
  socket.emit('join', id)

  // il faudra peut etre revoir ca, tous mettre dans une fonction, ou faire une
  // fonction pour chaques type de notif
  // bref j'ai pas voulu trop avancer la dessus car en fonction des modifs qu'on va faire niveau front ca peut etre chaud
  /*socket.on('messageReceived', msgMetadata => {
    alert(`Hop vous avez un nouveaux message : ${msgMetadata.message}`)
  })*/

  /*  socket.on('matchEmit', () => {

  })*/

  /*  socket.on('likesEmit', () => {
    alert('like : fait un toster boloss')
    // ca marche visuellement, maintenan faut le coder pour de vraie !
  })*/
  return socket
}

export default setSocket
