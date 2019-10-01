import React from 'react'

import { Button, Form, Content } from 'react-bulma-components'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'

/**
 *  Parent of form generation.
 */
class FormConstructor extends React.Component {

  _mapperMethod(type, instruction) {
    const pascalCaseType =
      type.charAt(0).toUpperCase() + type.substring(1).toLowerCase()
    let parsingMethodName = '_' + instruction + pascalCaseType
    let methodName = this[parsingMethodName]

    if (typeof methodName === 'undefined') {
      parsingMethodName = '_' + instruction + 'Input'
      methodName = this[parsingMethodName]
    }
    return methodName
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange = e => {
    if (e.target.type === 'checkbox') {
      
      const categorie = e.target.getAttribute("categorie")
      let newCheckboxObj = this.state[categorie]
      newCheckboxObj[e.target.name] = !this.state[categorie][e.target.name]
      this.setState({
        categorie: newCheckboxObj
      })
    } else this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.handleForm(this.state)
  }

  render() {
    return (
      <div>
        {this.props.fields.map((field, index) => {
          return this._mapperMethod(field.type, 'render')(field)
        })}
        <Button onClick={this.handleSubmit}> Valider </Button>
        <Content size={'small'} style={{ color: 'red' }}>
          {!this.props.isValid ? 'pls fill all input' : ''}
        </Content>
      </div>
    )
  }

  _renderInput = elem => {
    return (
      <InputComponent
        {...elem}
        onChange={this.handleChange}
        value={this.state[elem.name]}
        key={elem.name + elem.type}
      />
    )
  }

  _renderCheckbox = elem => {
    let checkboxComponent

    if (this.state[elem.name] === undefined) {
      // je sais pas comment resoudre ce probleme !
      // si je fais un setState il n'est pas declarer quand 
      // j'arrive juste en dessous !!
      this.state[elem.name] = {}
    }
    return (
      <Form.Field key={elem.name + elem.type}>
        <Form.Control>
          <Form.Label>{elem.title}</Form.Label>
          {
            elem.checkboxValues.map((checkboxElem, index) => {
              if (typeof checkboxElem === 'string') {
                checkboxComponent = (
                  <Checkbox
                    categorie={elem.name}
                    name={checkboxElem}
                    label={checkboxElem}
                    onChange={this.handleChange}
                    checked={this.state[elem.name][checkboxElem]}
                    key={index}
                  />
                )
              } else {
                checkboxComponent = (
                  <Checkbox
                    categorie={elem.name}
                    name={checkboxElem.name}
                    label={checkboxElem.name}
                    onChange={this.handleChange}
                    checked={this.state[elem.name][checkboxElem.name]}
                    key={checkboxElem.id}
                  />
                )
              }
            return checkboxComponent
          })}
        </Form.Control>
      </Form.Field>
    )
  }
}

export default FormConstructor
