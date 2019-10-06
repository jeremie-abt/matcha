import React, { useState } from 'react'
import classNames from 'classnames'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

import Cookies from 'universal-cookie'

const FormLogin = ({ fields, setUserLogged }) => {
  const [isValid, setIsValid] = useState(true)
  //const isValid = true
  // const [redirect, setRedirect] = useState(false)

  const buttonStyle = {
    classes: classNames({
      'is-primary': true,
      'is-medium': true
    }),
    style: {
      fullwidth: true
    }
  }

  function printError () {
    setIsValid(false)
    setTimeout(() => setIsValid(true), 3000)
  }

  const handleSubmit = (submittedData) => {

    if (!submittedData.username || !submittedData.password)
      return setIsValid(false)
    axios.post('/users/authenticate', submittedData)
    .then((resp) => {
      const token = resp.data
      const cookies = new Cookies()
      cookies.set("token", token)
      setUserLogged()
    })
    .catch(e => {
      printError()
      console.log("attention il y a eu une error : ", e)
    })


    // alors tous ca c commenter mais faut savoir que ca ne l'etait pas avant
    // donc dans la versions qui marchait yavait tout ca
    // c bien trop complexe et le chargement des tags n'a rien a foutre la ???

    /*axios
      .post('/users/getUser', { ...submittedData })
      .then(result => {
        if (result.status === 200) {
          userData = result.data
        // enfaite ici je ne dois recevoir dans un premier temps uniquement
        // un token => ensuite je m'en servirais pour avoir les autres ressources !


      //    return axios.get('tags/all') Ce truc la n'a rien a foutre la !
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
        return axios.post('auth/getToken', userData)
      })
      .then (resp => {
        const token = resp.data
        const cookies = new Cookies()
        cookies.set('token', token)
      })
      .catch(e => {
        console.log(e)
      })*/
  }

  return (
    <div>
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
