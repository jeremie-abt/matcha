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

  const handleSubmit = (submittedData) => {

    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios.post('/users/authenticate', submittedData)
      .catch(e => {
        console.log("attention il y a eu une error : ", e)
      })
      .then((resp) => {
        const token = resp.data
        const cookies = new Cookies()
        cookies.set("token", token)
        setUserLogged()
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
