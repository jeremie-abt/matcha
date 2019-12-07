import React, { useState, useEffect } from 'react'
import UserContext from './UserContext'
import setSocket from './socket'

import Cookies from 'universal-cookie'
import axios from 'axios'

function MyProvider(props) {
  const [user, setUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [socketIo, setSocketIo] = useState(null)

  useEffect(() => {
    const verifyIfAuth = async () => {
      await setUserLogged()
      setHasFetched(true)
    }
    verifyIfAuth()
  }, [])

  const setUserLogged = () => {
    const cookies = new Cookies()
    const token = cookies.get('token')

    if (token !== undefined) {
      return axios
        .get('/users/getUser', {
          headers: {
            authorization: 'Bearer ' + cookies.get('token')
          }
        })
        .then(resp => {
          if (resp.data.verified_mail === true) setIsVerified(true)
          setSocketIo(setSocket(resp.data.id))
          setUser(resp.data)
          setIsAuth(true)
          //updateUser(resp.data)
          return resp.data
        })
        .catch(e => {
          console.log('bad Cookie !!', e)
          return undefined
        })
    } else return new Promise((resolve, reject) => resolve(undefined))
  }

  const HandleDisconnection = () => {
    const cookies = new Cookies()
    cookies.remove('token', { path: '/' })
    socketIo.emit('handleDisconnection', user.id)
    setIsAuth(false)
    setIsVerified(false)
    updateUser(false)
  }

  // fonction pour pouvoir update le user et le isAuth
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

  return (
    <div>
      {(!hasFetched && <div>loading ...</div>) || (
        <UserContext.Provider
          value={{
            store: {
              isAuth,
              isVerified,
              user
            },
            updateState: updateUser,
            setUserLogged: setUserLogged,
            HandleDisconnection: HandleDisconnection,
            socketIo: socketIo
          }}
        >
          {props.children}
        </UserContext.Provider>
      )}
    </div>
  )
}

export default MyProvider
