import React, { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import MatchaModal from '../../miscellaneous/Modal'

const fields = [
  {
    name: 'firstname',
    label: 'firstname',
    type: 'text'
  },
  {
    name: 'lastname',
    label: 'lastname',
    type: 'text'
  },
  {
    name: 'username',
    label: 'username',
    type: 'text'
  },
  {
    name: 'email',
    label: 'email',
    type: 'email'
  },
  {
    name: 'password',
    label: 'password',
    type: 'password'
  },
  {
    name: 'confirmpassword',
    label: 'confirmpassword',
    type: 'password'
  },
  {
    name: 'gender',
    title: 'gender',
    type: 'radio',
    radioValues: ['female', 'male']
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
  const { email, password, confirmpassword } = formData

  const verifyMailPattern = RegExp('^.{1,25}@.{2,15}\\.[^.]{2,4}$')
  if (confirmpassword !== password)
    return 'Password and confirmpassword are not the same ...'
  else if (!verifyMailPattern.exec(email))
    return 'please send a valid email ...'
  // faut faire des verifs sur les firstname et tout ?
  return true
}

function FormCreateProfil() {
  const [msg, setMsg] = useState([])

  const handleSubmit = ({ state }) => {
    const dataObligated = [
      'firstname',
      'lastname',
      'username',
      'email',
      'password',
      'confirmpassword',
      'gender'
    ]
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
        // creation du user
        axios
          .post('/users', state)
          .catch(e => {
            setMsg(['user already created', 'danger'])
          })
          .then(resp => {
            if (resp) {
              return axios.post(
                '/auth/sendTokenMail/',
                {
                  redirectionLink: 'http://localhost:3000/confirmationMail/',
                  id: resp.data.id,
                  email: state.email
                },
                { withCredentials: true }
              )
            }
          })
          .then(resp => {
            if (resp) {
              setMsg([
                'Profil created, you must valide your profil by email',
                'success'
              ])
            }
          })
          .catch(e => {
            setMsg([
              'Request failed contact the devTeam if it persist',
              'danger'
            ])
          })
      } else {
        setMsg([ret, 'danger'])
      }
    }
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
        msg={msg}
      />
    </div>
  )
}

export default FormCreateProfil
