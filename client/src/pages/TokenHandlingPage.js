import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router'
import Cookies from 'universal-cookie'
import axios from 'axios'
import userContext from '../context/UserContext'

import MatchaModal from '../components/Modal'

function TokenHandlingPage({ action, ...props }) {
  const contextUser = useContext(userContext)
  const isAuth = contextUser.store.isAuth
  const [isValid, setIsValid] = useState(false)
  const [isFalse, setIsFalse] = useState(false)
  const [redirect, setredirect] = useState(false)

  useEffect(() => {
    if (action === 'verifyaccount') {
      const params = props.match.params
      if (Object.keys(params).includes('token')) {
        const cookies = new Cookies()
        const token = params.token
        axios
          .get('/auth/confirmationMail/' + params.userId + '/' + token, {
            withCredentials: true,
            headers: {
              authorization: 'Bearer ' + cookies.get('token')
            }
          })
          .then(resp => {
            if (resp.status === 204) {
              setIsValid(true)
            }
          })
          .catch(e => {
            setIsFalse(true)
          })
      }
    }
  }, [isAuth, action, props.match.params, contextUser])

  const close = () => {
    if (isValid || isFalse) {
      setredirect(true)
    }
  }

  let msg = []
  if (isValid === true) {
    msg = ['Email confirmed !', 'success']
  } else if (isFalse === true) {
    msg = ['Email not confirmed, you should retry !', 'danger']
  }
  return (
    <div>
      {redirect && <Redirect to='/' />}
      {Object.entries(msg).length !== 0 && (
        <MatchaModal color={msg[1]} msg={msg[0]} onClose={close}></MatchaModal>
      )}
    </div>
  )
}

export default withRouter(TokenHandlingPage)
