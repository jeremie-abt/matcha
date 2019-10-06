import React from 'react'
import { Button } from 'react-bulma-components'

// pour l'instant j'hardcode mais le but c'est que en fonction du context
// il sache quel link afficher, si le mec est co
// on afficher se deco / update profile etc ...
// sinon on affiche sign in sign up etc....
class SubTestComponent extends React.Component {

  constructor(props) {
    
    super(props)
    this.state = {
      tags: {
        chien: true,
        sado: true
      }
    }
  }

  handleSubmit = (formData) => {
    console.log("bonjur")
    console.log("state down : ", this.state)
    this.props.onSubmit(this.state)
  }

  render() {
    return (
      <Button onClick={this.handleSubmit}>prout</Button>
    )
  }
}

export default SubTestComponent
