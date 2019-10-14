import React, { useState } from 'react'
import UserContext from './UserContext'
import setSocket from './socket'

import Cookies from 'universal-cookie'
import axios from 'axios'

function MyProvider(props) {
  const [user, setUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)

  const setUserLogged = () => {
    const cookies = new Cookies()
    const token = cookies.get('token')

    if (token !== undefined) {
      axios
        .get('/users/getUser', {
          headers: {
            authorization: 'Bearer ' + cookies.get('token')
          }
        })
        .then(resp => {
          if (resp.data.verified_mail === true) setIsAuth(true)
          updateUser(resp.data)
          setSocket(resp.data.id)
        })
        .catch(e => {
          console.log('bad Cookie !!', e)
        })
    }
  }

  const HandleDisconnection = () => {
    const cookies = new Cookies()
    cookies.remove('token')
    setIsAuth(false)
    updateUser(false)
  }

  const updateUser = newUser => {
    if (newUser === false) {
      setUser({})
    } else {
      const newUserContext = { ...user }
      Object.entries(newUser).forEach(([key, val]) => {
        newUserContext[key] = val
      })
      setUser(newUserContext)
    }
  }

  const _verifyIfAuth = () => {
    if (isAuth === false && Object.entries(user).length === 0) {
      setUserLogged()
    }
  }

  _verifyIfAuth()
  return (
    <UserContext.Provider
      value={{
        store: {
          isAuth,
          user
        },
        updateState: updateUser,
        setUserLogged: setUserLogged,
        HandleDisconnection: HandleDisconnection
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default MyProvider
