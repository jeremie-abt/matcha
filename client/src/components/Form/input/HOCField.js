import React from 'react'
import { Form } from 'react-bulma-components'
import PropTypes from 'prop-types';

/**
 *  Le but est d'encapsuler la logique bulma pour creer 
 *  un field, il prend donc un functionnal component
 *  lui passe toutes les props qu'il recoit en generant 
 *  un design cool
 */

function FormField({FieldComponent, ...props}) {

  return (
    <Form.Field>
      {
        props.label &&
        <Form.Label>
          {props.label}
        </Form.Label>
      }
      <Form.Control>
        <FieldComponent {...props} />
      </Form.Control>
    </Form.Field>
  )

  FormField.propTypes = {
    FieldComponent: PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.func
    ]) 
  }
}

export default FormField
