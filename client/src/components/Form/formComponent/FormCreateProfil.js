import React, { useState } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'

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
  const {
    email, password,
    confirmpassword, currentDate, 
    firstname, lastname, username } = formData

  let tmpDate = new Date()
  if (tmpDate - currentDate < 0) return 'Invalide Date'
  tmpDate = new Date(
      tmpDate.getFullYear() - 18,
      tmpDate.getMonth(), tmpDate.getDate()
  )
  if (currentDate >= tmpDate) return 'Invalide Date'
  const verifyNamePattern = RegExp('^(?=.*[a-zA-Z]{3,})')
  if (!verifyNamePattern.exec(firstname))
    return "prenom invalide ..."
  if (!verifyNamePattern.exec(lastname))
    return "nom invalide ..."
  if (!verifyNamePattern.exec(username))
    return "pseudo invalide ..."
  const verifyMailPattern = RegExp('^.{1,25}@.{2,15}\\.[^.]{2,4}$')
  // regex password : 
  // - at least one minuscule / majuscule / number / special character
  // - at least 8 character
  //console.log("fiestname : ", user)
  const verifyPasswordPattern = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
    );
  if (!verifyPasswordPattern.exec(password)) {
    return "le mot de passe est trop faible, il doit faire 8 caractere de long " +
          "et contenir au moins une lettre majuscule, minuscule, un chiffre " +
          "et un caractere special !"
  }
  if (confirmpassword !== password)
    return 'Password and confirmpassword ne sont pas identiques ...'
  else if (!verifyMailPattern.exec(email))
    return 'veuillez mettre une addresse mail valide ...'
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
