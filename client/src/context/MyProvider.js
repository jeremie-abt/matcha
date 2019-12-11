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
  const [isProfilCompleted, setIsProfilCompleted] = useState(false)

  useEffect(() => {
    const verifyIfAuth = async () => {
      await setUserLogged()
      setHasFetched(true)
    }
    verifyIfAuth()
  }, [])

  //const updateCompletedProfil = () => {
  useEffect(() => {
    // je pense qu'ici on peut partir du principe quon utilise
    // le contexte donc la variable user
    // A voir selon le sujet enfaite ils parlent de profils etendue
    // persos je demande a ce que le mec rajoute une bio au moins 
    // un Tag et son genre -> A voir
    if (Object.entries(user).length > 0 && 
        user.bio !== "" && user.tags.length > 0 && user.gender){
      setIsProfilCompleted(true)
    }
    // ya pas de else pour surveiller un retour du isprofilCompleted a false
    // car en theorie une fois quon a un profil completed, on ne peut pas
    // revenir en arriere !
  }, [user])
    
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
      /*if (isProfilCompleted === false) {
        updateCompletedProfil()
      }*/
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
          setUser(response.data)
          setIsAuth(true)
          //updateCompletedProfil()
          return {...response.data}
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
            updateProfilCompleted: setIsProfilCompleted
          }}
        >
          {props.children}
        </UserContext.Provider>
      )}
    </div>
  )
}

export default MyProvider
