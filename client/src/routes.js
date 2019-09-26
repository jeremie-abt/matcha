import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import FormUpdateProfil from './components/Form/formComponent/FormUpdateProfil'
import LoginPage from './pages/LoginPage'
import homePage from './pages/homePage'

import MyProvider from './context/MyProvider'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <MyProvider>
          <Route path='/homePage' component={ homePage } exact />
          <Route path='/' component={LoginPage} exact />
          <Route path='/FormUpdateProfil' component={FormUpdateProfil} exact />
        </MyProvider>
      </Switch>
    </div>
  </Router>
)

export default AppRouter
