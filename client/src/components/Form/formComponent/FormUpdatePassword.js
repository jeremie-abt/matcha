import React from 'react'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import { useToasts } from 'react-toast-notifications'
import Cookies from 'universal-cookie'
import parseFormData from '../../../helpers/validation'

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
function FormUpdatePassword({ setShowModal }) {
  const { addToast } = useToasts()

  const cookies = new Cookies()
  const handleSubmit = ({ state }) => {
    const dataObligated = ['password', 'confirmpassword']
    const isAllDataGiven = dataObligated.every(elem => {
      if (!state[elem]) {
        addToast('Merci de changer remplir tous les champs', {
          appearance: 'error',
          autoDismiss: true
        })
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
          .then(() => {
            addToast('Modification du mot de passe réussi', {
              appearance: 'success',
              autoDismiss: true
            })
          })
      } else {
        addToast(ret, {
          appearance: 'error',
          autoDismiss: true
        })
      }
    }
  }

  return (
    <div>
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={fields}
        handleForm={handleSubmit}
      />
    </div>
  )
}

export default FormUpdatePassword
