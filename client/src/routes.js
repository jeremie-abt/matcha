import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import MyProvider from './context/MyProvider'
import UserContext from './context/UserContext'

import NotLoggedRoutes from './routes/NotLoggedRoutes'
import LoggedRoutes from './routes/LoggedRoutes'

import ValidateMail from './pages/ValidateMail'
import ChangePasswordPage from './pages/ChangePasswordPage'

import DoubleRange from './components/Form/InputStyle/InputDoubleRange'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <MyProvider>
        <Switch>
          <Route component={DoubleRange} path='/test' />
          <Route
            path='/changePassword/:userId/:token'
            render={() => <ChangePasswordPage />}
            key={50}
          />
          <Route
            path='/confirmationMail/:userId/:token'
            render={() => <ValidateMail />}
            key={72}
          />
          <UserContext.Consumer>
            {context => {
              if (context.store.isAuth === false) {
                return <NotLoggedRoutes />
              } else {
                return <LoggedRoutes />
              }
            }}
          </UserContext.Consumer>
        </Switch>
      </MyProvider>
    </div>
  </Router>
)

export default AppRouter
