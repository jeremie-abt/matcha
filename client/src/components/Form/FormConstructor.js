import React from 'react'

import { Button } from 'react-bulma-components'
import Input from './InputStyle/InputStyle'
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
    this.props.fields.forEach(elem => {
      let handlingInputBindingFunc = this._mapperMethod(elem.type, "parse")
      handlingInputBindingFunc(elem)
    })
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
      <Input {...elem} onChange={this.handleChange}
          value={this.state[elem.name]}
          key={elem.name + elem.type} />
    )
  }

  _renderCheckbox = elem => {
    let checkboxComponent
    
    return (
      <div>
        <h1>{elem.title}</h1>
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
                  checked={this.state.checkbox[checkboxElem]}
                  key={ checkboxElem.id }
                  />
            }
            return (
              checkboxComponent
            )
          })
        }
      
      </div>
    )
  }
  
  // all the parsing input : those methods are only called
  // in the constructor mmethods for managing and biding the state
  _parseInput = elem => {
    const valueName = elem.name
    //this.setState({[valueName]: ""})
    this.state[valueName] = ""
  }

  _parseCheckbox = elem => {
    elem.checkboxValues.forEach(elem => {
      //let newCheckboxobj = this.state.checkbox
      //newCheckboxobj[elem] = false
      //this.setState({checkbox: newCheckboxobj})

      /**
       * Alors je sais que ce truc la plus celui du dessus donne des warnings
       * le probleme c'est que si je les corrige ca donne un autre warning
       * donc si tu as une solution ???
       * si jamais le decommente le code juste au deussus tu comrendra
       */
      this.state.checkbox[elem] = false
    })
  }
}

export default FormConstructor
