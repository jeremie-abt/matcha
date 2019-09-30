import React from 'react'

import MyProvider from './context/MyProvider'
import UserContext from './context/UserContext'

import NotLoggedRoutes from './routes/NotLoggedRoutes'
import LoggedRoutes from './routes/LoggedRoutes'


const AppRouter = () => (
  
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
)

export default AppRouter
