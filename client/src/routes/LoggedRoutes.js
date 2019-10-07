import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UserPage from '../pages/UserPage'
import UserContext from '../context/UserContext'

import DefaultPage from '../components/GeneralRedirection/LoggedDefaultPage'

function LoggedRoutes() {
  return (
    <Switch>
      <UserContext.Consumer>
        {context => {
          return ([
            <Route
              path='/profil'
              render={() => <UserPage userInfos={context.store.user} />}
              userInfos={context.store.user}
              key={1}
              exact
            />,
            
            <Route
              path='*'
              component={DefaultPage}
              userInfos={context.store.user}
              key={2}
              exact
            />]
          )
        }}
      </UserContext.Consumer>
    </Switch>
  )
}

export default LoggedRoutes
