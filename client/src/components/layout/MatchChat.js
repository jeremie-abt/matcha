import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MessageBubble from '../miscellaneous/MessageBubble'
import ChatBar from '../miscellaneous/ChatBar'

const funSentences = [
  'ne fait pas patienter ton match ...',
  'bah alors on a pas de couilles ?? allez hophophop on fait le premier pas ...',
  'Bien joue mon khey, allez maintenan parle lui ...',
  "jai plus d'inspi mais t'as interet a lui parler sinon je vais venir chez toi !!"
]
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function MatchChat({ roomId, userId }) {
  // get all the match for the user Id

  const [message, setMessage] = useState([])
  const [noMessages, setNoMessages] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  function handlePostingMessage() {
    axios.post('/messages', {
      roomId: roomId,
      senderId: userId,
      message: currentMessage
    })
  }

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
      {noMessages && (
        <div>{funSentences[getRandomInt(funSentences.length - 1)]}</div>
      )}
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
        handleSubmit={handlePostingMessage}
      />
    </div>
  )
}

export default MatchChat
