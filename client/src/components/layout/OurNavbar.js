import React from 'react'
import { Button } from 'react-bulma-components'

import HeaderLinks from './HeaderLinks'
import UserContext from '../../context/UserContext'
import { Link } from 'react-router-dom'

function OurNavbar() {
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
          href='/'
          className='navbar-burger burger'
          aria-label='menu'
          aria-expanded='false'
          data-target='navbarBasicExample'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>

      <div id='navbarBasic' className='navbar-menu'>
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
              <Link to='/match' className='navbar-item'>
                match
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
