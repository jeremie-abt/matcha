import React, { useState } from 'react'
import { Button } from 'react-bulma-components'

import HeaderLinks from './HeaderLinks'
import UserContext from '../../context/UserContext'
import { Link } from 'react-router-dom'

function OurNavbar() {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <nav
      className='navbar layout-color'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='navbar-brand'>
        <a className='navbar-item' href='/'>
          <img src={require('../../assets/img/OUI.png')} alt='logo' />
        </a>

        <a
          role='button'
          onClick={handleClick}
          className={'navbar-burger burger ' + (isActive ? 'is-active' : '')}
          aria-label='menu'
          aria-expanded='false'
          data-target='navbarBasic'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div
        id='navbarBasic'
        className={'navbar-menu ' + (isActive ? 'is-active' : '')}
      >
        <div className='navbar-start'>
          <Link to='/search' className='navbar-item'>
            Search
          </Link>
          <div className='navbar-item has-dropdown is-hoverable'>
            <div className='navbar-link'>Mes informations</div>

            <div className='navbar-dropdown'>
              <Link to='/myProfil' className='navbar-item'>
                Mon profil
              </Link>
              <Link to='/account' className='navbar-item'>
                Mon compte
              </Link>
              <Link to='/images' className='navbar-item'>
                Mes images
              </Link>
              <Link to='/like' className='navbar-item'>
                Likes
              </Link>
              <Link to='/seen' className='navbar-item'>
                Vues
              </Link>
            </div>
          </div>
        </div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <UserContext.Consumer>
              {context => {
                if (!context.store.isAuth) return <HeaderLinks />
                else
                  return (
                    <Button onClick={context.HandleDisconnection}>
                      Deconnect
                    </Button>
                  )
              }}
            </UserContext.Consumer>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default OurNavbar
