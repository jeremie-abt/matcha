import React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import MyProvider from './context/MyProvider'
import UserContext from './context/UserContext'

import NotLoggedRoutes from './routes/NotLoggedRoutes'
import LoggedRoutes from './routes/LoggedRoutes'

const history = createBrowserHistory()

const AppRouter = () => (

  <Router history={history}>
    <div>
      <MyProvider>
        <UserContext.Consumer>
          {
            context => {
              if (context.store.isAuth === false)
                return <NotLoggedRoutes />
              else
                return <LoggedRoutes />
            }
          }
        </UserContext.Consumer>
      </MyProvider>
    </div>
  </Router>

  

)

export default AppRouter
