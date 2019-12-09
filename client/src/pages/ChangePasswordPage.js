import React, { useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'
import axios from 'axios'
import FormUpdatePassword from '../components/Form/formComponent/FormUpdatePassword'

const ValidateMail = withRouter(({ match }) => {

  const [redirect, setRedirect] = useState(false)
  const { token, userId } = match.params
  const cookies = new Cookies()

  // les tokens correspondent -> OK
  // le tokens ne correspondent pas -> redirection

  
  if (!redirect && cookies.get('mailToken') === token) {
    return (
      <FormUpdatePassword userId={userId} setRedirect={setRedirect} />
    )
  } 
  return (
    <Redirect link='/'/>
  )
})

export default ValidateMail
