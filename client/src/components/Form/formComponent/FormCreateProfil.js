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
    name: 'birthdate',
    title: 'birthdate',
    type: 'datepicker'
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
  const { email, password, confirmpassword, currentDate } = formData

  let tmpDate = new Date()
  if (tmpDate - currentDate < 0) return 'Date invalid'
  tmpDate = new Date(
      tmpDate.getFullYear() - 18,
      tmpDate.getMonth(), tmpDate.getDate()
  )
  if (currentDate >= tmpDate) return 'Date invalid'
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

  const handleSubmit = ({ state, currentDate }) => {
    const dataObligated = [
      'firstname',
      'lastname',
      'username',
      'email',
      'password',
      'confirmpassword',
    ]
    if (!currentDate) {
      setMsg(['pls fill all input', 'error'])
      return null
    }
    const isAllDataGiven = dataObligated.every(elem => {
      if (!state[elem]) {
        setMsg(['pls fill all input', 'error'])
        return false
      }
      return true
    })
    if (isAllDataGiven) {
      const ret = parseFormData({ ...state, currentDate })
      if (ret === true) {
        // creation du user
        axios
          .post('/users', { ...state, birthdate:currentDate })
          .catch(e => {
            setMsg(['user already created', 'error'])
          })
          .then(resp => {
            console.log("oui")
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
              'error'
            ])
          })
      } else {
        setMsg([ret, 'error'])
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
