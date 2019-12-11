import React, { useContext, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import UserContext from '../context/UserContext'
import { usePosition } from 'use-position'
import axios from 'axios'

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

const API_KEY = 'AIzaSyBYgNn_j0zaXwMWFAdAGP3VMDKxcPRcNjI'

function LoggedRoutes() {
  const context = useContext(UserContext)
  const { latitude, longitude, error } = usePosition()

  useEffect(() => {
    if (latitude && longitude && !error) {
      geolocData(latitude, longitude, error)
    }
    if (error) {
      axios
        .post(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`
        )
        .then(result => {
          const { lat, lng } = result.data.location
          geolocData(lat, lng)
        })
        .catch(err => {
          throw err
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, error])

  const geolocData = (lat, long, error = null) => {
    if (!error && lat && long) {
      axios
        .post('/geoloc/add', { userId: context.store.user.id, lat, long })
        .then(() => {
          context.updateUser({
            lat,
            long
          })
        })
        .catch(err => {
          throw err
        })
    }
    if (error) {
    }
  }


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
