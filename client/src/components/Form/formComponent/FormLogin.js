import React, { useState } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import { Redirect } from 'react-router-dom'


const FormLogin = ({ fields, updateUser, updateIsAuth }) => {
  const [isValid, setIsValid] = useState(true)
  const [redirect, setRedirect] = useState(false)

  const handleSubmit = submittedData => {
    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios
      .post('/users/getUser', { ...submittedData })
      .then(result => {
        if (result.status === 200) {
          setRedirect(true)
          updateUser(result.data)
          updateIsAuth()
        } else if (result.status === 204) alert('Invalid data')
      })
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <div>
      {
        redirect && <Redirect to="/"/>
      }
      <FormConstructor
        fields={fields}
        handleForm={handleSubmit}
        isValid={isValid}
      />
    </div>
  )
}

export default FormLogin
