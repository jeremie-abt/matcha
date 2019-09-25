import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import FormUpdateProfil from './components/Form/formComponent/FormUpdateProfil'
import LoginPage from './pages/LoginPage'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/FormUpdateProfil' component={FormUpdateProfil} exact />
        <Route path='/' component={LoginPage} exact />
      </Switch>
    </div>
  </Router>
)

export default AppRouter
