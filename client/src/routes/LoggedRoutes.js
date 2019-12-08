import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UserContext from '../context/UserContext'

import Profil from '../components/Profil/Profil'
import Match from '../components/layout/Match'
import Images from '../components/UserImages/UserImages'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Histo from '../components/Profil/Histo'
import FormFilter from '../components/Form/formComponent/FormFilter'
import DefaultPage from '../components/GeneralRedirection/LoggedDefaultPage'
import Layout from '../components/layout/PageSkeleton'
import MatchChat from '../components/layout/MatchChat'
import { BrowserRouter } from 'react-router-dom'

function LoggedRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <UserContext.Consumer>
            {context => {
              return [
                <Route path='/search' render={() => <FormFilter />} key={2} />,
                <Route path='/account' render={() => <UpdateForm />} key={3} />,
                <Route
                  path='/myProfil'
                  render={() => <Profil userInfos={context.store.user} />}
                  key={4}
                />,
                <Route
                  path='/images'
                  render={() => <Images userId={context.store.user.id} />}
                  key={5}
                />,
                <Route
                  path='/like'
                  render={() => <Histo type='like' />}
                  key={6}
                />,
                <Route
                  path='/seen'
                  render={() => <Histo type='seen' />}
                  key={7}
                />,
                <Route
                  path='/'
                  component={DefaultPage}
                  userInfos={context.store.user}
                  key={8}
                  exact
                />,
                <Route 
                  path='/match'
                  component={Match}
                  key={9}
                  exact
                />,
                <Route 
                  path='/chat'
                  component={MatchChat}
                  key={10}
                  exact
                />
              ]
            }}
          </UserContext.Consumer>
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

export default LoggedRoutes
