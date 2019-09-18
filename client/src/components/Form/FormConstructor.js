import React from 'react'

import { Button, Form } from 'react-bulma-components'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'


/**
 *  Parent of form generation.
 */
class FormConstructor extends React.Component {

  _mapperMethod (type, instruction) {

    const pascalCaseType =
        type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
    let parsingMethodName = "_" + instruction + pascalCaseType
    let methodName = this[parsingMethodName]

    if (typeof methodName === "undefined") {
      parsingMethodName = "_" + instruction + "Input"
      methodName = this[parsingMethodName]
    }
    return (methodName)
  }

  constructor(props) {
    super(props)

    this.state = {}
    this.state["checkbox"] = {}
  }
  
  handleChange = e => {
    if (e.target.type === "checkbox") {
      let newCheckboxobj = this.state.checkbox
      newCheckboxobj[e.target.name] = !this.state.checkbox[e.target.name]
      this.setState({
        checkbox: newCheckboxobj
      })
    }
    else 
      this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    this.props.handleForm(this.state)
  }
  
  render() {

    return (
      <div>
        {
          this.props.fields.map((field, index) => {
            return (
              this._mapperMethod(field.type, "render")(field)
            )
          })
        }
        <Button onClick={ this.handleSubmit }> Valider </Button>
      </div>
      
    )
  }
  
  _renderInput = elem => {
    return (
      <InputComponent {...elem} onChange={this.handleChange}
          value={this.state[elem.name]}
          key={elem.name + elem.type} />
    )
  }

  _renderCheckbox = elem => {
    let checkboxComponent
    
    return (
      <Form.Field key={elem.name + elem.type}>
        <Form.Control>
          <Form.Label>{elem.title}</Form.Label>
          {
            elem.checkboxValues.map((checkboxElem, index) => {
              if (typeof checkboxElem === "string") {
                checkboxComponent =  <Checkbox
                    name={checkboxElem} label={checkboxElem}
                    onChange={this.handleChange}
                    checked={this.state.checkbox[checkboxElem]}
                    key={index}
                    />
            }
              else {
                checkboxComponent = <Checkbox
                    name={checkboxElem.name}
                    label={checkboxElem.name}
                    onChange={this.handleChange}
                    checked={this.state.checkbox[checkboxElem.name]}
                    key={ checkboxElem.id }
                    />
              }
              return (
                checkboxComponent
              )
            })
          }
        
        </Form.Control>
      </Form.Field>
    )
  }
}

export default FormConstructor
