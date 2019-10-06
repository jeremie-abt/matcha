import React from 'react'
import { Navbar } from 'react-bulma-components'
import SubTestComponent from './SubTestComponent'


// pour l'instant j'hardcode mais le but c'est que en fonction du context
// il sache quel link afficher, si le mec est co
// on afficher se deco / update profile etc ...
// sinon on affiche sign in sign up etc....
class ComponentTest extends React.Component {

  handleSubmit(formData) {
    
    console.log("Upper component : ", formData)
  }

  render () {
    console.log("protu")
    return (
      <SubTestComponent onSubmit={this.handleSubmit}/>
    )
  }
}

export default ComponentTest
