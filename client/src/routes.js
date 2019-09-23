import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import FormUpdateProfil from './components/Form/formComponent/FormUpdateProfil'
import Test from './pages/test'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/FormUpdateProfil' component={FormUpdateProfil} exact />
        <Route path='/test' component={Test} exact />
      </Switch>
    </div>
  </Router>
)

export default AppRouter
