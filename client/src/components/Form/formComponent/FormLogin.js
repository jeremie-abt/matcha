import React, { useState } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

const FormLogin = ({ fields, updateUser, updateIsAuth }) => {
  const [isValid, setIsValid] = useState(true)

  const handleSubmit = submittedData => {
    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios
      .post('/users/getUser', { ...submittedData })
      .then(result => {
        if (result.status === 200) {
          alert('On est bon les gars')
          updateUser(result.data)
          updateIsAuth()
        } else if (result.status === 204) alert('Invalid data')
      })
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <FormConstructor
      fields={fields}
      handleForm={handleSubmit}
      isValid={isValid}
    />
  )
}

export default FormLogin
