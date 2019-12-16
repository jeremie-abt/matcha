import React from 'react'
import { Form, Columns } from 'react-bulma-components'

// est ce qu'on ne peut pas faire juste un wrapper de style ??
function InputStyle({ label, defaultInfo, ...props }) {
  
  return (
    <Columns.Column size={12}>
      <Form.Field>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control>
          <Form.Input {...props} placeholder={defaultInfo} />
        </Form.Control>
      </Form.Field>
    </Columns.Column>
  )
}

export default InputStyle
