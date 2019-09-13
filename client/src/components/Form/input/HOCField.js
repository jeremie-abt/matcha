import React from 'react'
import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types';

/**
 *  Le but est d'encapsuler la logique bulma pour creer 
 *  un field, il prend donc un functionnal component
 *  lui passe toutes les props qu'il recoit en generant 
 *  un design cool
 */

function FormField({
  FieldComponent, eventHandlingFunc, label,
  event, ...props}) {
  
  let inputEvent = {}
  if (event && Array.isArray(event)) {
    // inputEvent["value"] = value
    event.forEach(elem => {
      if (elem in eventHandlingFunc) {
        inputEvent[elem] = eventHandlingFunc[elem]
      }
    })
  }
  return (
    <Form.Field>
      {
        label &&
        <Form.Label>
          {label}
        </Form.Label>
      }
      <Form.Control>
        <FieldComponent {...props} {...inputEvent} />
      </Form.Control>
    </Form.Field>
  )

  FormField.propTypes = {
    FieldComponent: PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.func
    ]),
    eventHandlingFunc: PropTypes.oneOfType([
      React.PropTypes.object
    ]),
  }
}

export default FormField
