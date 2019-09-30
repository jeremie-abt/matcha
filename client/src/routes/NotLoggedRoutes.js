import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import HomePage from '../pages/homePage'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from  '../pages/LoginPage'

const history = createBrowserHistory()

function NotLoggedRoutes(){
  return (
    <Router history={history}>
      <div>
        <Switch>

            <Route path='/' component={ HomePage } exact />

            <Route path='/login' component={ LoginPage } exact />

            <Route path='/register' component={ RegisterPage } exact />

        </Switch>
      </div>
    </Router>
  )
}

export default NotLoggedRoutes
