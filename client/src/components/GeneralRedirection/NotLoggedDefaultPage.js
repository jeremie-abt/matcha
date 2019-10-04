import React from 'react'
import { Redirect } from 'react-router-dom'

function NotLoggedDefaultPage() {
  return <Redirect to='/' />
}

export default NotLoggedDefaultPage
