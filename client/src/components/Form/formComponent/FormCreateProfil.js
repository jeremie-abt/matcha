import React, { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import parseFormData from '../../../helpers/validation'

const fields = [
  {
    name: 'firstname',
    label: 'prenom',
    type: 'text'
  },
  {
    name: 'lastname',
    label: 'nom',
    type: 'text'
  },
  {
    name: 'username',
    label: 'pseudo',
    type: 'text'
  },
  {
    name: 'email',
    label: 'email',
    type: 'email'
  },
  {
    name: 'password',
    label: 'mot de passe',
    type: 'password'
  },
  {
    name: 'confirmpassword',
    label: 'confirmez votre mot de passe',
    type: 'password'
  },
  {
    name: 'birthdate',
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

function FormCreateProfil({ setAccountCreated }) {
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
      setMsg(['remplissez tous le champs', 'error'])
      return null
    }
    const isAllDataGiven = dataObligated.every(elem => {
      if (!state[elem]) {
        setMsg(['remplissez tous le champs', 'error'])
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
            console.log("err : ", e)
            setMsg(['user deja existant', 'error'])
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
              setAccountCreated(true)
            }
        })
          .catch(e => {
            setMsg([
              'Error contactez les dev si l\'erreur persiste',
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
