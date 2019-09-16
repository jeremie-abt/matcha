import React from 'react'
import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types';


function FieldWrapper({
  FieldComponent,
  onChangeFunc,
  label, ...props
  }) {
  
  return (
    <Form.Field>
      {
        label &&
        <Form.Label>
          {label}
        </Form.Label>
      }
      <Form.Control>
        <FieldComponent
            {...props} onChange={onChangeFunc} /> 
      </Form.Control>
    </Form.Field>

  )

  FieldWrapper.propTypes = {
    FieldComponent: PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.func
    ]),
    onChangeFunc: PropTypes.oneOfType([
      React.PropTypes.object
    ]),
  }
}

export default FieldWrapper
