import React from 'react'
import { Router, Route, Switch } from "react-router-dom"
import test from './pages/test'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const AppRouter = () => (
  <div>
    <Router history={ history }>
      <div>
        <Switch>
          <Route path="/" component={ test } />
        </Switch>
      </div>
    </Router>
  </div>
)

export default AppRouter