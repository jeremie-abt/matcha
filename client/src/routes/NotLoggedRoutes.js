import React from 'react'
import { Route, Switch } from 'react-router-dom'

import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import DefaultRedirectPage from '../components/GeneralRedirection/NotLoggedDefaultPage'

function NotLoggedRoutes() {
  return (
    <Switch>
      <Route path='/register' component={RegisterPage} />
      <Route path='/' component={LoginPage} />
      <Route exact path='*' component={DefaultRedirectPage} />
    </Switch>
  )
}

export default NotLoggedRoutes
