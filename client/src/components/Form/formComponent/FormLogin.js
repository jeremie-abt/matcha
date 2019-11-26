import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import MatchaModal from '../../miscellaneous/Modal'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
  const { addToast } = useToasts()
  const [msg, setMsg] = useState([])
  const buttonStyle = {
    classes: classNames({
      'is-primary': true,
      'is-medium': true
    }),
    style: {
      fullwidth: true
    }
  }

  const handleSubmit = ({ state }) => {
    let keepRefToToken

    if (!state.username || !state.password) {
      addToast('Merci de remplir entièrement le formulaire', {
        appearance: 'error',
        autoDismiss: true
      })
      return
    }
    axios
      .post('/users/authenticate', state)
      .then(resp => {
        keepRefToToken = resp.data
        return axios.get('/users/getUser', {
          headers: {
            authorization: 'Bearer ' + keepRefToToken
          }
        })
      })
      .then(resp => {
        if (resp.status === 200) {
          const { banned } = resp.data
          if (!banned) {
            const cookies = new Cookies()
            cookies.set('token', keepRefToToken, { path: '/' })
            setUserLogged()
          } else {
            addToast(
              'Cette utilisateur a été banni suite à de nombreux report',
              {
                appearance: 'error',
                autoDismiss: true
              }
            )
          }
        }
      })
      .catch(e => {
        if (e.response.status === 401) {
          addToast('Les données ne sont pas valide', {
            appearance: 'error',
            autoDismiss: true
          })
        } else {
          addToast('An error occured', {
            appearance: 'error',
            autoDismiss: true
          })
        }
      })
  }

  return (
    <div>
      {Object.entries(msg).length !== 0 && (
        <MatchaModal color={msg[1]} msg={msg[0]} setMsg={setMsg}></MatchaModal>
      )}
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={fields}
        handleForm={handleSubmit}
        msg={msg}
      />
    </div>
  )
}

export default FormLogin
