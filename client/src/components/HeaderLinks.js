import React from 'react'
import { withRouter } from 'react-router-dom'
import { Navbar } from 'react-bulma-components'

// pour l'instant j'hardcode mais le but c'est que en fonction du context
// il sache quel link afficher, si le mec est co
// on afficher se deco / update profile etc ...
// sinon on affiche sign in sign up etc....
function HeaderLinks(props) {
  return (
    // isoler les deux trucs du dessous !
    <div className='buttons'>
      <Navbar.Item
        href='/register'
        className='button is-primary'
        key='register'
      >
        Sign Up
      </Navbar.Item>
    </div>
  )
}

export default withRouter(HeaderLinks)
