import React from 'react'
import { Navbar, Level, Content } from 'react-bulma-components'

import HeaderLinks from './HeaderLinks'
import UserContext from '../../context/UserContext'

// un peu degueux pour l'image je suis d'accord
// mais je pense qu'on verra plus tard pour passer
// en props etc ...
function OurNavbar() {
  return (
    <Content>
      <Level>
        <Level.Side align='left'>
          <Navbar.Item href='/'>
            <figure>
              <img src={require('../../assets/img/OUI.png')} alt='logo' />
            </figure>
          </Navbar.Item>
        </Level.Side>
        <Level.Side align='right'>
          <UserContext.Consumer>
            {context => {
              if (!context.store.isAuth) return <HeaderLinks />
              else return <p>Deconnexion button not Implemented yet</p>
            }}
          </UserContext.Consumer>
        </Level.Side>
      </Level>
    </Content>
  )
}

export default OurNavbar
