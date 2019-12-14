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
  const [isProfilCompleted, setIsProfilCompleted] = useState(0)
  // isProfilCompleted state :
  // 0 -> we don't know yet
  // 1 -> It is completed !
  // 2 and all superior integer -> no its not completed

  useEffect(() => {
    const verifyIfAuth = async () => {
      await setUserLogged()
      setHasFetched(true)
    }
    verifyIfAuth()
  }, [])

  const verifyProfilCompleted = () => {
    if (
      Object.entries(user).length > 0 &&
      user.bio !== '' &&
      user.tags.length > 0 &&
      user.gender
    ) {
      axios
        .get('/' + user.id + '/images')
        .then(resp => {
          if (resp.data.length > 0) {
            setIsProfilCompleted(1)
          } else {
            setIsProfilCompleted(2)
          }
        })
        .catch(e => {
          console.log('\n\nerr : ', e, '\n\n  ')
          setIsProfilCompleted(2)
        })
    } else if (Object.entries(user).length > 0) {
      setIsProfilCompleted(2)
    }
  }

  useEffect(() => {
    // je l'ai mis dans une fonction a part comme ca
    // je peux donner verifyProfilCompleted dans mon
    // context ce qui permet au composant image
    // de call manuellement la fonction pour reverif que
    // tout est bien !
    verifyProfilCompleted()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

  const setUserLogged = () => {
    const cookies = new Cookies()
    const token = cookies.get('token')

    if (token !== undefined) {
      //{ latitude, longitude, error } = usePosition()
      return axios
        .get('/users/getUser', {
          headers: {
            authorization: 'Bearer ' + cookies.get('token')
          }
        })
        .then(response => {
          if (response.data.verified_mail === true) setIsVerified(true)
          setSocketIo(setSocket(response.data.id))
          const user = response.data
          user.nbNotifs = user.notifications.length
            ? user.notifications.length
            : 0
          setUser(user)
          setIsAuth(true)
          //updateCompletedProfil()
          return { ...response.data }
        })
        .catch(e => {
          console.log('bad Cookie !!', e)
          return undefined
        })
    } else return new Promise((resolve, reject) => resolve(undefined))
  }

  const HandleDisconnection = () => {
    const cookies = new Cookies()
    socketIo.emit('handleDisconnection', user.id)
    cookies.remove('token', { path: '/' })
    setIsAuth(false)
    setIsVerified(false)
    updateUser(false)
  }

  return (
    <div>
      {(!hasFetched && <div>loading ...</div>) || (
        <UserContext.Provider
          value={{
            store: {
              isAuth,
              isVerified,
              user,
              isProfilCompleted: isProfilCompleted
            },
            updateUser: updateUser,
            setUserLogged: setUserLogged,
            HandleDisconnection: HandleDisconnection,
            socketIo: socketIo,
            updateProfilCompleted: verifyProfilCompleted
          }}
        >
          {props.children}
        </UserContext.Provider>
      )}
    </div>
  )
}

export default MyProvider
