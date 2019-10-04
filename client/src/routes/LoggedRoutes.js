import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UserPage from '../pages/UserPage'
import UserContext from '../context/UserContext'

function LoggedRoutes() {
  return (
    <Switch>
      <UserContext.Consumer>
        {context => {
          console.log('context:', context)
          return (
            <Route
              path='/profil'
              render={() => <UserPage userInfos={context.store.user} />}
              userInfos={context.store.user}
              exact
            />
          )
        }}
      </UserContext.Consumer>
    </Switch>
  )
}

export default LoggedRoutes
