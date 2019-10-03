import React, { useState } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import { Redirect } from 'react-router-dom'


// ne serait il pas plus logique de mettre tout ca dans le provider ?
// genre toute la logique de fetch des data ?
const FormLogin = ({ fields, updateUser, updateIsAuth }) => {
  const [isValid, setIsValid] = useState(true)
  const [redirect, setRedirect] = useState(false)

  let userData
  const handleSubmit = submittedData => {
    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios
      .post('/users/getUser', { ...submittedData })
      .then(result => {
        if (result.status === 200) {
          userData = result.data
          return (
            axios.get("tags/all")
            )
          } else if (result.status === 204) alert('Invalid data')
        })
      .then(result => {
        const tagsWithName = result.data.filter(elem => {
          return (userData.tags.includes(elem.id))
        })
          .map(elem => elem.name)
        userData.tags = tagsWithName
        setRedirect(true)
        updateUser(userData)
        updateIsAuth()
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
