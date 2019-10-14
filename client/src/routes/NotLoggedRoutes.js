import React from 'react'
import { Route, Switch } from 'react-router-dom'

import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import DefaultRedirectPage from '../components/GeneralRedirection/NotLoggedDefaultPage'

import TokenHandlingPage from '../pages/TokenHandlingPage'

function NotLoggedRoutes() {
  return (
    <Switch>
      <Route path='/register' component={RegisterPage} />
      <Route
        path='/confirmationMail/:userId/:token'
        render={() => <TokenHandlingPage action='verifyaccount' />}
        key={2}
      />
      ,
      <Route path='/' component={LoginPage} />
      <Route exact path='*' component={DefaultRedirectPage} />
    </Switch>
  )
}

export default NotLoggedRoutes
