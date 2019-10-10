import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
  const [msg, setMsg] = useState('')
  //const [isValid, setIsValid] = useState(true)
  const buttonStyle = {
    classes: classNames({
      'is-primary': true,
      'is-medium': true
    }),
    style: {
      fullwidth: true
    }
  }

  function printMsg (msg) {
    setMsg(msg)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSubmit = ({ state }) => {
    
    let keepRefToToken
  
    if (!state.username || !state.password){
      return setMsg("Pls fill all the input !")
    }
    axios.post('/users/authenticate', state)
    .then((resp) => {
      keepRefToToken = resp.data
      return axios.get(
        '/users/getUser',
        {
          headers: {
            authorization: 'Bearer ' + keepRefToToken
          }
        }
      )
    })
    .then(resp => {
      if (resp){
        if (resp.data.verified_mail === false) {
          printMsg("veuillez valider votre email avant de pouvoir vous co")
        } else {
          const cookies = new Cookies()
          cookies.set("token", keepRefToToken)
          setUserLogged()
        }
      }
    })
    .catch(e => {
      if (e.response.status === 401)
        printMsg("Can't logged in, Data provided are wrong")
      else
        printMsg("Can't logged in, Something went wrong")
    })
  }

  return (
    <div>
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
