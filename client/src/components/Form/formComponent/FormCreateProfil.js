import React, { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import parseFormData from '../../../helpers/validation'

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
      console.log("state ; ", state)
      const ret = parseFormData({ ...state, currentDate })
      if (ret === true) {
        // creation du user
        axios
          .post('/users', { ...state, birthdate:currentDate })
          .catch(e => {
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
              setMsg([
                'success, vous devez maintenan valider votre profil par mail',
                'success'
              ])
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
