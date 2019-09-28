import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import homePage from './pages/homePage'
import RegisterPage from './pages/RegisterPage'

import MyProvider from './context/MyProvider'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <MyProvider>
          <Route path='/login' component={ LoginPage } exact />
         
          <Route path='/' component={ homePage  } exact />

          <Route path='/register' component={ RegisterPage } exact />
        </MyProvider>
      </Switch>
    </div>
  </Router>
)

export default AppRouter
