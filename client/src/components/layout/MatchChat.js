import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import MessageBubble from '../miscellaneous/MessageBubble'
import ChatBar from '../miscellaneous/ChatBar'
import UserContext from '../../context/UserContext'
import Cookies from 'universal-cookie'
import { Columns, Card } from 'react-bulma-components'
import { useToasts } from 'react-toast-notifications'
import { withRouter } from 'react-router'

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

const MatchChat = withRouter(({ location }) => {
  const { addToast } = useToasts()
  const context = useContext(UserContext)
  const userId = context.store.user.id

  const [message, setMessage] = useState([])
  const [noMessages, setNoMessages] = useState(true)
  const [currentMessage, setCurrentMessage] = useState('')
  const [chattingWithUser, setChattingWithUser] = useState({})

  const roomId = location.state.roomId
  const username = location.state.username
  const idToSend = location.state.idToSend

  useEffect(() => {
    const cookies = new Cookies()
    axios
      .get('/users/getUser/' + idToSend, {
        headers: {
          authorization: 'Bearer ' + cookies.get('token')
        }
      })
      .then(resp => {
        setChattingWithUser(resp.data)
      })
      .catch(e => {
        addToast(`Impossible to load messages : ${e}`, {
          appearance: 'error',
          autoDismiss: true
        })
      })
  }, [addToast, idToSend])

  function handlePostingMessage() {
    axios
      .post('/messages', {
        roomId: roomId,
        senderId: userId,
        message: currentMessage
      })
      .then(resp => {
        const io = context.socketIo
        io.emit('messageSent', idToSend, resp.data, userId, username)
        let newMessageArray = [...message]
        newMessageArray.push(resp.data)
        setMessage(newMessageArray)
      })
    if (noMessages === true) {
      setNoMessages(false)
    }
  }

  useEffect(() => {
    const socket = context.socketIo
    socket.on('messageReceived', msgMetadata => {
      let newMessageArray = [...message]
      newMessageArray.unshift(msgMetadata)
      setMessage(newMessageArray)
      setNoMessages(false)
    })
  }, [context.socketIo, message])

  useEffect(() => {
    axios.get('/messages/' + roomId).then(resp => {
      if (resp.data.length > 0) {
        setMessage(resp.data)
        setNoMessages(false)
      }
    })
  }, [roomId])

  return (
    <div>
      {noMessages && <div>{sentence}</div>}
      <Card className='card-fullwidth'>
        <Card.Content>
          <Columns.Column className='chat'>
            {message.length > 0 &&
              message.map((elem, index) => {
                return (
                  <MessageBubble
                    MessageInfo={elem}
                    userInfos={
                      elem.sender_id === context.store.user.id
                        ? context.store.user
                        : chattingWithUser
                    }
                    isCurrentUser={elem.sender_id === context.store.user.id}
                    key={index}
                  />
                )
              })}
          </Columns.Column>
        </Card.Content>
      </Card>
      <ChatBar
        setCurrentMessage={setCurrentMessage}
        currentMessage={currentMessage}
        handleSubmit={e => {
          if (currentMessage.trim() !== '') handlePostingMessage(e)
        }}
      />
    </div>
  )
})

export default MatchChat
