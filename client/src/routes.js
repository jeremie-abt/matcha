import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import MyProvider from './context/MyProvider'
import UserContext from './context/UserContext'

import NotLoggedRoutes from './routes/NotLoggedRoutes'
import LoggedRoutes from './routes/LoggedRoutes'

import TokenHandlingPage from './pages/TokenHandlingPage'

const history = createBrowserHistory()

const AppRouter = () => (
  <Router history={history}>
    <div>
      <MyProvider>
        <Switch>
          <Route
            path='/confirmationMail/:userId/:token'
            render={() => <TokenHandlingPage />}
            key={2}
          />
          <UserContext.Consumer>
            {context => {
              if (context.store.isAuth === false) return <NotLoggedRoutes />
              else return <LoggedRoutes />
            }}
          </UserContext.Consumer>
        </Switch>
      </MyProvider>
    </div>
  </Router>
)

export default AppRouter
