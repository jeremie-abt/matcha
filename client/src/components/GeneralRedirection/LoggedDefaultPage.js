import React from 'react'
import { Redirect } from 'react-router-dom'

function LoggedDefaultPage() {
  return <Redirect to='/profil' />
}

export default LoggedDefaultPage
