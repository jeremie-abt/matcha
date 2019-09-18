
import React from 'react'
import { Form } from 'react-bulma-components'

function CheckboxStyle({ onChange, label, ...props }) {

  return (
      <Form.Checkbox onChange={onChange} {...props}>
        {label}
      </Form.Checkbox>
    
  )
}

export default CheckboxStyle
