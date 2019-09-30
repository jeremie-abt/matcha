import React from 'react'
import { Route, Switch } from 'react-router-dom'

import UserPage from '../pages/UserPage'


function LoggedRoutes() {
  return (
    <Switch>

        <Route path='/' component={ UserPage } exact />

    </Switch>
  )
}

export default LoggedRoutes
