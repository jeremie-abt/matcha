import React, { useState, useContext } from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import classNames from 'classnames'
import axios from 'axios'
import FormConstructor from '../FormConstructor'
import Crypto from 'crypto-js'
import Cookies from 'universal-cookie'

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

function generateMailToken() {

  return Crypto.lib.WordArray.random(28).toString()
}

function parseFormData(formData) {
  
  const {
    email, password, confirmpassword
  } = formData

  
  const verifyMailPattern = RegExp(
    "^.{1,25}@.{2,15}\\.[^.]{3,5}$"
  )
  if (confirmpassword !== password)
    return "Password and confirmpassword are not the same ..."
  else if (!verifyMailPattern.exec(email))
    return "please send a valid email ..."
  // faut faire des verifs sur les firstname et tout ? 
  return true
}

function FormCreateProfil({ setUserLogged}) {
  
  const [msg, setMsg] = useState('')
  
  const handleSubmit = ({state}) => {
    
    const dataObligated = [
      'firstname', 'lastname', 'username', 'email',
      'password', 'confirmpassword'
    ]
    const isAllDataGiven = 
      dataObligated.every(elem => {
        if (!state[elem]){
          setMsg("pls fill all input")
          return false
        }
        return true
      })
    if (isAllDataGiven) {
      const ret = parseFormData(state)
      if (ret === true) {
        // creation du user
        axios.post('/users', state)
          .catch((e) => {
            console.log("petite erreur visiblement ", e)
          })
          .then(resp => {
            if (resp){
              return axios.post(
                '/users/authenticate', state
              )
            }
          })
          .then(resp => {

          if (resp) {
              return [
                axios.post(
                  "/auth/sendTokenMail/",
                  {
                    redirectionLink: "http://localhost:3000/confirmationMail/",
                    id: resp.data.id,
                    email: state.email
                  }
                ),
                resp.data
              ]
            }
          })
          .then(resp => {
            if (resp) {
              const cookies = new Cookies()
              cookies.set("token", resp[1])
              setUserLogged()
            }
          })
          .catch(e=> {
            console.log("oui nous somme ici : ", e)
          })
      } else {
        setMsg(ret)
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
