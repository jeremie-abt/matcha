import React from 'react'
import { withRouter } from 'react-router-dom'
import { Navbar } from 'react-bulma-components'


// pour l'instant j'hardcode mais le but c'est que en fonction du context
// il sache quel link afficher, si le mec est co
// on afficher se deco / update profile etc ...
// sinon on affiche sign in sign up etc....
function HeaderLinks( props ) {

    const myItems = [
      <Navbar.Item href="/login" className="button" key="login">Sign in</Navbar.Item>,
      <Navbar.Item href="/register" className="button is-primary" key="register">Sign Up</Navbar.Item>
    ]

    return (
      // isoler les deux trucs du dessous !
      <div className="buttons">
        {
          myItems.filter((elem) => {
            return (elem.props.href !== props.location.pathname)
          })
        }
      </div>
     
    )
}

export default withRouter(HeaderLinks)
