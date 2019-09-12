import React, { useState } from 'react'

// il faut trouver un moyen de rendre ca plus propre !!!
import Button from './input/SubmitButton'
import Input from './input/Input'
import Field from './input/HOCField'

/**
 * jabt's old login form
 */

const fieldComponentMap = {
  default: Input,
  submit: Button
}

class Form extends React.Component {

  
  constructor({ fields }) {
    super(fields)
    
    this.handleFuncMapping = {
      onChange: this.handleChange,
    }
    this.fields = fields
    let state_construction = {}
    fields.forEach(elem => {
      state_construction[elem.name]  = ''
    })
    this.state = state_construction
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value })
  }


  render(props) {
    return (
      this.fields.map(field => {
        let tmp

        const FieldComponent = (
          field.type in fieldComponentMap ?
            fieldComponentMap[field.type] :
            fieldComponentMap["default"]
        )
        // pour l'instant je ne stock pas la value
        const inputEvent = {}

        if ("event" in field) {
          field.event.forEach(elem => {
            inputEvent[elem] = this.handleFuncMapping[elem]
          })
          input = <Field
                    FieldComponent={FieldComponent}
                    value={this.state[field.name]}
                    {...inputEvent} />
        }
        else {
          input = <Field
                  FieldComponent={FieldComponent}/> 
        }

        return (
          <Field
            FieldComponent={FieldComponent}
              "event" in field &&
              value=this.state[field.name]
            {...inputEvent}
            />
        )
      }) 
    )
  }
}

export default Form
