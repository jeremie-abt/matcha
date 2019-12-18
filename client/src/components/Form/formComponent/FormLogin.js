/* eslint-disable no-throw-literal */
import React from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
  const { addToast } = useToasts()
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
        if (resp.data === 'Wrong data') throw 'Wrong data'
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
        if (e === 'wrong data') {
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
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={fields}
        handleForm={handleSubmit}
      />
    </div>
  )
}

export default FormLogin
