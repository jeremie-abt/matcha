import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import UserPage from '../pages/UserPage'

const history = createBrowserHistory()

function LoggedRoutes() {
  return (
    <Router history={history}>
      <div>
        <Switch>

            <Route path='/' component={ UserPage } exact />

        </Switch>
      </div>
    </Router>
  )
}

export default LoggedRoutes
