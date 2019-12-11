/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react'
import { Button } from 'react-bulma-components'

import HeaderLinks from './HeaderLinks'
import UserContext from '../../context/UserContext'
import { Link } from 'react-router-dom'

function OurNavbar() {
  const [isActive, setIsActive] = useState(false)
  const context = useContext(UserContext)
  const handleClick = () => {
    setIsActive(!isActive)
  }
  const isAuth = context.store.isAuth
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
        {isAuth && (
          <div className='navbar-start'>
            <Link to='/search' className='navbar-item'>
              Search
            </Link>
            {/* Notifications is-hoverable disable during loading*/}
            <div className={'navbar-item has-dropdown '}>
              <div className=' navbar-item '>
                <Link
                  to='/notifications'
                  data-badge={context.store.user.nbNotifs}
                  className={
                    'navbar-item has-dropdown has-badge-rounded has-badge-danger ' +
                    (context.store.user.nbNotifs <= 0
                      ? 'has-badge-outlined'
                      : '')
                  }
                >
                  Mes Notifications
                </Link>
              </div>
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
            {/* informations */}
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
        )}
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
