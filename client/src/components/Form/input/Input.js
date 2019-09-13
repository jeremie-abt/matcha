import React from 'react'
import { Form, Button } from 'react-bulma-components'

function Input(props) {
  console.log("Wesshhhh les props : ", props)
  return (
    <Form.Input 
      {...props} 
    />
  )
}

export default Input
