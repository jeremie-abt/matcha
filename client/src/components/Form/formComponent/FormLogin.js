import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import { Redirect } from 'react-router-dom'

const FormLogin = ({ fields, updateUser, updateIsAuth }) => {
  const [isValid, setIsValid] = useState(true)
  const [redirect, setRedirect] = useState(false)

  const buttonStyle = {
    classes: classNames({
      'is-primary': true,
      'is-medium': true
    }),
    style: {
      fullwidth: true
    }
  }

  let userData = {}
  const handleSubmit = submittedData => {
    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios
      .post('/users/getUser', { ...submittedData })
      .then(result => {
        if (result.status === 200) {
          userData = result.data
          return axios.get('tags/all')
        } else if (result.status === 204) alert('Invalid data')
      })
      .then(result => {
        if (result.data.tags) {
          const tagsWithName = result.data
            .filter(elem => {
              return userData.tags.includes(elem.id)
            })
            .map(elem => elem.name)
          userData.tags = tagsWithName
        }
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
      {redirect && <Redirect to='/profil' />}
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
