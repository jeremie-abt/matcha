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


  // il doit gerer les Input avec evenement 
  // et les input sans evement
  // Problem, on doit attacher la value de l'Input avec le state de lui
  // donc au moment de la construction ?  
  constructor( {fields} ) {
    super(fields)
    
    this.eventHandlingFunc = {
      onChange: this.handleChange,
      onClick: this.handleSubmit
    }
    this.fields = fields
    let state_construction = {}
    fields.forEach(elem => {
      // bind la value au state uniquement si des events 
      // ont ete specifie
      if ("event" in elem && "onChange" in elem["event"])
        state_construction[elem.name]  = ''
    })
    this.state = state_construction
  }

  handleSubmit = e => {
    e.preventDefault()
    alert("Submit Form not implemented")
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value })
  }

  render(props) {
    return (
      <div>
      {
        this.fields.map((field, index) => {
          const FieldComponent = (
            field.type in fieldComponentMap ?
              fieldComponentMap[field.type] :
              fieldComponentMap["default"]
          )

          // si y'a un event dans ce cas la on bind
          // la value sinon nop, si t'as une meilleur
          // facons de faire jsuis grave preneur
          let InputComponentRet
          
          // la key c'est un truc de react ca met une
          // erreur sinon
          // askip faut pas mettre d'index 
          // https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
          // mais bon ca va c'est des formulaire 
          // bref go lire l'article et changer au pire
        

          if ("event" in field
              && field["event"].includes("onChange")) {
            InputComponentRet = <Field
              key={index}
              FieldComponent={FieldComponent}
              eventHandlingFunc={this.eventHandlingFunc}
              value={this.state[field.name]}
              {...field} />
          } else {
            InputComponentRet = <Field
              key={index}
              FieldComponent={FieldComponent}
              eventHandlingFunc={this.eventHandlingFunc}
              {...field} />
          }
          return (
            InputComponentRet
          )
        })
      }
      </div>
    )
  }
}

export default Form
