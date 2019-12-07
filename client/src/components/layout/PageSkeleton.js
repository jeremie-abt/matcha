import { Section, Container, Columns } from 'react-bulma-components'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import OurHeader from './OurHeader'
import OurFooter from './OurFooter'

import React, { useState, useContext, useEffect } from 'react'
import { Button, Content } from 'react-bulma-components'
import axios from 'axios'
import Cookies from 'universal-cookie'
import userContext from '../../context/UserContext'
import { useToasts } from 'react-toast-notifications'

// import Title from '../components/layout/PageTitle'
import MatchaModal from '../miscellaneous/Modal'
// dynamic components
// import Match from '../components/layout/Match'
// import MatchChat from '../components/layout/MatchChat'
import { usePosition } from 'use-position'

// Si on veut mettre le projet sur github, ne pas oublier de mettre
// cete key dans un ./env
const API_KEY = 'AIzaSyBYgNn_j0zaXwMWFAdAGP3VMDKxcPRcNjI'

function PageSkeleton({ location, children }) {
  const myClasses = classNames({
    homepage: true,
    'image-background': location.pathname === '/',
    'register-background': location.pathname === '/register'
  })

  const [msg, setMsg] = useState([])
  const context = useContext(userContext)
  const { addToast } = useToasts()
  // const [curComponent, setCurComponent] = useState('search')

  // let chatMsgInfos = useRef(null)
  // const setChatComponent = msgInfos => {
  //   chatMsgInfos.current = msgInfos
  //   setCurComponent('matchChat')
  // }

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
          context.store.user.lat = lat
          context.store.user.long = long
        })
        .catch(err => {
          throw err
        })
    }
    if (error) {
    }
  }

  // const componentsMapping = {
  //   matchMenu: () => (
  //     <Match userId={context.store.user.id} setCurComponent={setChatComponent} />
  //   ),
  //   matchChat: () => {
  //     return (
  //       <MatchChat
  //         roomId={chatMsgInfos.current[0]}
  //         idToSend={chatMsgInfos.current[1]}
  //       />
  //     )
  //   }
  // }

  // Voir ca demain !!!!
  useEffect(() => {
    context.socketIo.on('notifPrinting', type => {
      addToast(`vous avez un nouveau ${type}`, {
        appearance: 'success',
        autoDismiss: true
      })
    })
  }, [addToast, context.socketIo])

  // ~! Bouger ce truc ailleur
  const sendNewMail = () => {
    const cookies = new Cookies()
    cookies.remove('mailToken')
    axios
      .post(
        '/auth/sendTokenMail',
        {
          redirectionLink: 'http://localhost:3000/confirmationMail/',
          id: context.store.user.id,
          email: context.store.user.email
        },
        { withCredentials: true }
      )
      .then(resp => {
        setMsg(['Mail has been resend, please validate it', 'success'])
      })
      .catch(e => {
        setMsg(['Error, mail has not been sent', 'danger'])
      })
  }

  return (
    <div className='layout-color'>
      <OurHeader />
      <Section className={myClasses}>
        <Container>
          <Columns>
            {context.store.user.verified_mail === false ? (
              <div>
                {Object.entries(msg).length !== 0 && (
                  <MatchaModal
                    color={msg[1]}
                    msg={msg[0]}
                    setMsg={setMsg}
                  ></MatchaModal>
                )}
                <Content>
                  <h1>You must confirm your mail</h1>
                  <Button onClick={sendNewMail}>
                    Click here to send new Mail
                  </Button>
                </Content>
              </div>
            ) : (
              <Columns.Column>{children}</Columns.Column>
            )}
          </Columns>
        </Container>
      </Section>
      <OurFooter />
    </div>
  )
}

export default withRouter(PageSkeleton)
