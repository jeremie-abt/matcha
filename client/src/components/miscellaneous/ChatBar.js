import React from 'react'
import { Form, Button } from 'react-bulma-components'

// function made for hook
// It's assuming that setMessage is a function returned
// by useState
function ChatBar({ setCurrentMessage, currentMessage, handleSubmit }) {
  
  function sendMessage() {
    handleSubmit()
    setCurrentMessage('')
  }

  return (
    <div>
      <Form.Field>
        <Form.Label>MESSAGE</Form.Label>
        <Form.Control>
          <Form.Textarea
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
          />
        </Form.Control>
      </Form.Field>
      <Button onClick={sendMessage}>Envoyer</Button>
    </div>
  )
}

export default ChatBar