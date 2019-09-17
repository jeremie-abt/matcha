import React from 'react'

// il faut trouver un moyen de rendre ca plus propre !!!
import { Button } from 'react-bulma-components'
import Input from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'


/*import Input from './input/Input'
import InputCheckbox from './input/CheckboxField'
import FieldWrapper from './input/FieldWrapper'*/

/**
 * jabt's old login form
 */



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

    this.fields = props.fields
    this.state = {}

    this.state["checkbox"] = {}
    props.fields.forEach(elem => {
      let handlingInputBindingFunc = this._mapperMethod(elem.type, "parse")
      handlingInputBindingFunc(elem)
    })
  }
  
  handleSubmit = e => {
    e.preventDefault()
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
  
  render(props) {

    return (
      <div>
        {
          this.fields.map((field, index) => {
            return (
              this._mapperMethod(field.type, "render")(field)
            )
            
          })
        }
        <Button onClick={this.handleSubmit}> Valider </Button>
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
    return (
      elem.checkboxValues.map(checkboxElem => {
        return (
          <Checkbox
              label={checkboxElem} name={checkboxElem}
              onChange={this.handleChange}
              checked={this.state.checkbox[checkboxElem]}
              key={"checkbox" + checkboxElem}
              />
        )
      })
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
