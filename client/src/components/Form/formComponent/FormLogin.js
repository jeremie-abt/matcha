import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
  const [isValid, setIsValid] = useState(true)

  const buttonStyle = {
    classes: classNames({
      'is-primary': true,
      'is-medium': true
    }),
    style: {
      fullwidth: true
    }
  }

  function printError () {
    setIsValid(false)
    setTimeout(() => setIsValid(true), 3000)
  }

  const handleSubmit = ({ state }) => {

    if (!state.username || !state.password){
      return setIsValid(false)
    }
    
    axios.post('/users/authenticate', state)
    .then((resp) => {
      const token = resp.data
      const cookies = new Cookies()
      cookies.set("token", token)
      setUserLogged()
    })
    .catch(e => {
      printError()
    })
  }

  return (
    <div>
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={fields}
        handleForm={handleSubmit}
        isValid={isValid}
      />
    </div>
  )
}

export default FormLogin
