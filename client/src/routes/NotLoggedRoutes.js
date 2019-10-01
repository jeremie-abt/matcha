import React from 'react'
import { Route, Switch } from 'react-router-dom'

import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'

function NotLoggedRoutes() {
  return (
    <Switch>
      <Route path='/' component={LoginPage} exact />
      <Route path='/register' component={RegisterPage} exact />
    </Switch>
  )
}

export default NotLoggedRoutes
