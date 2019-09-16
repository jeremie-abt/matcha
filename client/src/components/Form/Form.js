import React from 'react'

// il faut trouver un moyen de rendre ca plus propre !!!
import { Button } from 'react-bulma-components'
import Input from './input/Input'
import FieldWrapper from './input/FieldWrapper'

/**
 * jabt's old login form
 */

const fieldComponentMap = {
  default: Input,
}

class Form extends React.Component {


  // il doit gerer les Input avec evenement 
  // et les input sans evement
  // Problem, on doit attacher la value de l'Input avec le state de lui
  // donc au moment de la construction ?  
  constructor(props) {
    super(props)

    this.fields = props.fields
    let state_construction = {}
    this.fields.forEach(elem => {
      // bind la value au state uniquement si des events 
      // ont ete specifie
        state_construction[elem.name]  = ''
    })
    this.state = state_construction
  }

  handleSubmit = e => {
    e.preventDefault()
    alert("Submit Form not implemented")
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
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

            return (
              <FieldWrapper
                key={index}
                FieldComponent={FieldComponent}
                onChangeFunc={this.handleChange}
                value={this.state[field.name]}
                {...field} />
            )
          })
        }
        <Button onClick={this.handleSubmit}> Valider </Button>
      </div>
    )
  }
}

export default Form
