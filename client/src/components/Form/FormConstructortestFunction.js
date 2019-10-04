import React from 'react'

import { Button, Form, Content } from 'react-bulma-components'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'
import MyRadio from './InputStyle/RadioStyle'

/**
 *  Parent of form generation.
 */
handleChange = e => {
  /// je sais toute la partie pour gerer le radio est horrible
  /// c degueux mais bon tempis on ca fonctionne et on aura
  /// surement pas besoins d'ajouter d'autre composant DONC HEIN


  if (e.target.type === 'checkbox') {
    const categorie = e.target.getAttribute("categorie")
    let newCheckboxObj = this.state[categorie]
    newCheckboxObj[e.target.name] = !this.state[categorie][e.target.name]

    this.setState({
      [categorie]: newCheckboxObj
    })
  } else if (e.target.type === 'radio') {
    const categorie = e.target.getAttribute("categorie")
/*      let newCheckboxObj = this.state[categorie]
    newCheckboxObj[e.target.name] = (
      this.state[categorie][e.target.name] === "yes" ?
      "no" : "yes"
    )
    console.log("newCheeck : ", newCheckboxObj)*/
    this.setState({
      [categorie]: e.target.name
    })
  } else this.setState({ [e.target.name]: e.target.value })
}

handleSubmit = e => {
  e.preventDefault()
  this.props.handleForm(this.state)
}

_mapperMethod(type, instruction) {
  // faire des if ici

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

function FormConstructor(props) {


/*  constructor(props) {

    console.log("CONSTRUCTOR CALLED : ")
    super(props)
    let checkboxStateName = props.fields
      .filter(elem => (elem.type === "checkbox" || elem.type === "radio")) // attention au radio

    let stateConstructorObj = {}
    let radioObj = {}
    let checkboxObj = {}
    this.props.fields.map(elem => {
      
      if (elem.type === "checkbox") {
        if ("data-checkbox-activated" in elem) {
          checkboxObj[elem.name] = {}
          console.log("data truc : ", elem)
          
          Object.entries(elem["data-checkbox-activated"]).forEach(([key, val]) => {
            console.log("key : ", key)
            console.log("val : ", val)
            checkboxObj[elem.name][key] = val
          }) 
          /*elem["data-checkbox-activated"].forEach(subelem => {
            checkboxObj[elem.name][subelem] = true
          })*/
          /*
        }
      } else if (elem.type === "radio") {
        radioObj[elem.name] = elem["data-radio-curval"]
      }
    })

    this.state = {
      ...checkboxObj,
      ...radioObj
    }
  }*/


  render() {
    // console.log("\n\nprops ici : ", this.props.fields, "\n\n")
    // console.log("render state : ", this.state)

    const data = 
    return (
      <div>
        {this.props.fields.map((field) => {
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

  _renderRadio = elem => {
    
    return (
      elem.radioValues.map( radioElem => {
        return <MyRadio
          categorie={elem.name}
          label={radioElem}
          name={radioElem}
          handleChange={this.handleChange}
          checked={this.state[elem.name] === radioElem}
          key={radioElem + elem.type}
        />
      })
    )
  }

  _renderCheckbox = elem => {
    let checkboxComponent

    return (
      <Form.Field key={elem.name + elem.type}>
        <Form.Control>
          <Form.Label>{elem.title}</Form.Label>
          {
            elem.checkboxValues.map(checkboxElem => {
              
              // a terme faut vire ce truc 
              // je le laisse car ca peut faire spawn des bueg
              /*if (typeof checkboxElem === 'string') {
                console.log("ICIICICICICICI")
                checkboxComponent = (
                  <Checkbox
                    categorie={elem.name}
                    name={checkboxElem}
                    label={checkboxElem}
                    handleChange={this.handleChange}
                    checked={this.state[elem.name].includes(checkboxElem)}
                    key={index}
                  />
                )
            } */
              checkboxComponent = (
                <Checkbox
                  categorie={elem.name}
                  name={checkboxElem.name}
                  label={checkboxElem.name}
                  handleChange={this.handleChange}
                  checked={this.state[elem.name][checkboxElem.name]}
                  key={checkboxElem.id}
                />
              )
              return checkboxComponent
                
            })
          }
        </Form.Control>
      </Form.Field>
    )
  }
}

export default FormConstructor
