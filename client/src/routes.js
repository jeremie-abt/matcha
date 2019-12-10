import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ToastProvider } from 'react-toast-notifications'

import MyProvider from './context/MyProvider'
import UserContext from './context/UserContext'

import NotLoggedRoutes from './routes/NotLoggedRoutes'
import LoggedRoutes from './routes/LoggedRoutes'

import ValidateMail from './pages/ValidateMail'

const history = createBrowserHistory()

const AppRouter = () => (
  <ToastProvider>
    <Router history={history}>
      <div>
        <MyProvider>
          <Switch>
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
  </ToastProvider>
)

export default AppRouter
