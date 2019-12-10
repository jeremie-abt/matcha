import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'
import FormUpdatePassword from '../components/Form/formComponent/FormUpdatePassword'

const ValidateMail = withRouter(({ match }) => {

  const [redirect, setRedirect] = useState(false)
  const { token, id } = match.params
  const cookies = new Cookies()
  // les tokens correspondent -> OK
  // le tokens ne correspondent pas -> redirection

  
  if (!redirect && cookies.get('mailToken') === token) {
    return (
      <FormUpdatePassword userId={id} setRedirect={setRedirect} />
    )
  } 
  return (
    <Redirect link='/'/>
  )
})

export default ValidateMail
