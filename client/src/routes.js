import React from 'react'
import { Router, Route, Switch } from "react-router-dom"
import LoginPage from './pages/LoginPage'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={ history }>
    <div>
      <Switch>
        <Route path="/login" component={ LoginPage } exact /> 
        <Route path="/formtest" component={ LoginPage } exact /> 
      </Switch>
    </div>
  </Router>
)

export default AppRouter
