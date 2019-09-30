import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from '../pages/homePage'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from  '../pages/LoginPage'

function NotLoggedRoutes(){
  return (
        <Switch>

            <Route path='/' component={ HomePage } exact />

            <Route path='/login' component={ LoginPage } exact />

            <Route path='/register' component={ RegisterPage } exact />

        </Switch>
  )
}

export default NotLoggedRoutes
