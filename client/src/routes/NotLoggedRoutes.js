import React from 'react'
import { Route, Switch } from 'react-router-dom'

import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import DefaultPage from '../components/GeneralRedirection/NotLoggedDefaultPage'

import TokenHandlingPage from '../pages/TokenHandlingPage'


function NotLoggedRoutes() {
  return (
    <Switch>
      <Route exact path='/' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />
      <Route
        path='/confirmationMail/:token'
        render={ () => <TokenHandlingPage action="verifyaccount"/> }
        key={2}
      />,
    </Switch>
  )
}

export default NotLoggedRoutes
