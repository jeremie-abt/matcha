import React from 'react'
import { Navbar, Level, Content } from 'react-bulma-components'

import HeaderLinks from './HeaderLinks'

// un peu degueux pour l'image je suis d'accord
// mais je pense qu'on verra plus tard pour passer
// en props etc ...
function OurNavbar() {
  
  return (
    <Content>
      <Level>
        <Level.Side align="left">
          <Navbar.Item href="/">
            <figure>
              <img src={require('../assets/img/matchaIcon.jpg')}
                  alt="logo" />
            </figure>
          </Navbar.Item>
        </Level.Side>
        <Level.Side align="right">
          <HeaderLinks />
        </Level.Side>
      </Level>
    </Content>
  )
}

export default OurNavbar
