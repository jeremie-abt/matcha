import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router'
import axios from 'axios'

import MatchaModal from '../components/miscellaneous/Modal'

function ValidateMail(props) {
  const [isValid, setIsValid] = useState(false)
  const [isFalse, setIsFalse] = useState(false)
  const [redirect, setredirect] = useState(false)

  useEffect(() => {
    const params = props.match.params
    const token = params.token
    axios
      .get('/auth/confirmationMail/' + token, {
        withCredentials: true
      })
      .then(resp => {
        if (resp.status === 200) {
          return axios.get('/auth/verifyMail/' + params.userId, {
            withCredentials: true
          })
        }
      })
      .then(resp => {
        if (resp && resp.status === 200) {
          setIsValid(true)
        }
      })
      .catch(e => {
        setIsFalse(true)
      })
  }, [props.match.params])

  const close = () => {
    setredirect(true)
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

export default withRouter(ValidateMail)
