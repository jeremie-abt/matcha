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
    <div style={{ marginTop: '20px' }}>
      <Form.Field>
        <Form.Label>MESSAGE</Form.Label>
        <Form.Control>
          <Form.Textarea
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
          />
        </Form.Control>
      </Form.Field>
      <Button onClick={sendMessage} className='is-primary'>
        Envoyer
      </Button>
    </div>
  )
}

export default ChatBar
