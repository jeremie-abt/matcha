import React from 'react'
import { Form } from 'react-bulma-components'

// est ce qu'on ne peut pas faire juste un wrapper de style ??
function InputStyle({ label, ...props }) {
  return (
    <Form.Field>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control>
        <Form.Input {...props} />
      </Form.Control>
    </Form.Field>
  )
}

export default InputStyle
