import React, { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import { Redirect } from 'react-router-dom'

import MatchaModal from '../../miscellaneous/Modal'
import Cookies from 'universal-cookie'

const fields = [
  {
    name: 'password',
    label: 'password',
    type: 'password'
  },
  {
    name: 'confirmpassword',
    label: 'confirmpassword',
    type: 'password'
  }
]

const buttonStyle = {
  classes: classNames({
    'is-primary': true,
    'is-medium': true
  }),
  style: {
    fullwidth: true
  }
}

function parseFormData(formData) {
  const { password, confirmpassword } = formData

  if (confirmpassword !== password)
    return 'Password and confirmpassword are not the same ...'
  return true
}

function FormUpdatePassword() {
  const [redirection, setRedirection] = useState(false)
  const [msg, setMsg] = useState([])

  const cookies = new Cookies()
  const handleSubmit = ({ state }) => {
    const dataObligated = ['password', 'confirmpassword']
    const isAllDataGiven = dataObligated.every(elem => {
      if (!state[elem]) {
        setMsg(['pls fill all input', 'danger'])
        return false
      }
      return true
    })
    if (isAllDataGiven) {
      const ret = parseFormData(state)
      if (ret === true) {
        axios
          .post(
            '/users/updatePassword',
            {
              password: state.password
            },
            {
              headers: {
                authorization: 'Bearer ' + cookies.get('token')
              },
              withCredentials: true
            }
          )
          .then(resp => {
            setMsg(['password changed', 'success'])
          })
      } else {
        setMsg([ret, 'danger'])
      }
    }
  }

  const handleClose = () => {
    setRedirection(true)
  }

  return (
    <div>
      {redirection && <Redirect to='/' />}
      {Object.entries(msg).length !== 0 && (
        <MatchaModal
          color={msg[1]}
          msg={msg[0]}
          onClose={handleClose}
        ></MatchaModal>
      )}
      {
        <FormConstructor
          buttonStyle={buttonStyle}
          fields={fields}
          handleForm={handleSubmit}
        />
      }
    </div>
  )
}

export default FormUpdatePassword
