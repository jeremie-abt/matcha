import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import MatchaModal from '../../../components/Modal'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
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
      setMsg(['Pls fill all the input !', 'danger'])
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
        if (resp) {
          const cookies = new Cookies()
          cookies.set('token', keepRefToToken)
          setUserLogged()
          /*if (resp.data.verified_mail === false) {
            setMsg(['Please confirm your mail', 'danger'])
          } else {
          }*/
        }
      })
      .catch(e => {
        if (e.response.status === 401) setMsg(['Wrong Data', 'danger'])
        else setMsg(['Something went wrong', 'danger'])
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
      />
    </div>
  )
}

export default FormLogin
