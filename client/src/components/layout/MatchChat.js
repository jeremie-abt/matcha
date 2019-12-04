import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import MessageBubble from '../miscellaneous/MessageBubble'
import ChatBar from '../miscellaneous/ChatBar'
import UserContext from '../../context/UserContext'

const funSentences = [
  'ne fait pas patienter ton match ...',
  'bah alors on a pas de couilles ?? allez hophophop on fait le premier pas ...',
  'Bien joue mon khey, allez maintenan parle lui ...',
  "jai plus d'inspi mais t'as interet a lui parler sinon je vais venir chez toi !!"
]
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
const sentence = funSentences[getRandomInt(funSentences.length - 1)]

function MatchChat({ roomId, idToSend }) {
  const context = useContext(UserContext)
  const userId = context.store.user.id

  const [message, setMessage] = useState([])
  const [noMessages, setNoMessages] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  function handlePostingMessage() {
    axios
      .post('/messages', {
        roomId: roomId,
        senderId: userId,
        message: currentMessage
      })
      .then(resp => {
        const io = context.socketIo
        io.emit('messageSent', idToSend, resp.data)
        let newMessageArray = [...message]
        newMessageArray.push(resp.data)
        setMessage(newMessageArray)
      })
  }

  useEffect(() => {
    const socket = context.socketIo
    socket.on('messageReceived', msgMetadata => {
      let newMessageArray = [...message]
      newMessageArray.push(msgMetadata)
      setMessage(newMessageArray)
    })
  }, [context.socketIo, message])

  // recuperer les messages, je me doute bien quon va changer ca
  // mais autant faire au plus simple et rapide et faire les modifs
  // quils faudra quand on fera du front
  useEffect(() => {
    axios.get('/messages/' + roomId).then(resp => {
      if (resp.data.length > 0) {
        setMessage(resp.data)
      } else {
        setNoMessages(true)
      }
    })
    // on fait quoi pour la gestion derreurs ??
  }, [roomId])
  // recuperer tous les 100 dernieres messages ?
  return (
    <div>
      {noMessages && <div>{sentence}</div>}
      {message.length > 0 &&
        message.map((elem, index) => {
          return (
            <MessageBubble
              MessageInfo={elem}
              currentUserId={userId}
              key={index}
            />
          )
        })}
      <ChatBar
        setCurrentMessage={setCurrentMessage}
        currentMessage={currentMessage}
        handleSubmit={e => {
          if (!noMessages) setNoMessages(true)
          handlePostingMessage(e)
        }}
      />
    </div>
  )
}

export default MatchChat
