
import React from 'react'
import { Form } from 'react-bulma-components'

function CheckboxStyle({ handleChange, label, ...props }) {

  return (
      <Form.Checkbox onChange={handleChange} {...props}>
        {label}
      </Form.Checkbox>
    
  )
}

export default CheckboxStyle
