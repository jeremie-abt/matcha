import React from 'react'
import { withRouter } from 'react-router-dom'
import { Navbar } from 'react-bulma-components'

// pour l'instant j'hardcode mais le but c'est que en fonction du context
// il sache quel link afficher, si le mec est co
// on afficher se deco / update profile etc ...
// sinon on affiche sign in sign up etc....

function HeaderLinks(props) {
  const myItems = [
    <Navbar.Item href='/' className='button is-primary' key='login'>
      Sign in
    </Navbar.Item>,
    <Navbar.Item href='/register' className='button is-primary' key='register'>
      Sign Up
    </Navbar.Item>
  ]

  return (
    <div className='buttons'>
      {props.location.pathname === '/register' ? myItems[0] : myItems[1]}
    </div>
  )
}
export default withRouter(HeaderLinks)
