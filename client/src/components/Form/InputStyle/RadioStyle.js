import React from 'react'
import { Form } from 'react-bulma-components'

function RadioStyle({ handleChange, label, ...props }) {
  return (
    <Form.Radio {...props} onChange={handleChange}>
      <span class='is-capitalized'>&nbsp;{label}</span>
    </Form.Radio>
  )
}

export default RadioStyle
