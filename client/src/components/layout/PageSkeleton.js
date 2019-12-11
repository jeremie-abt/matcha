import { Section, Container, Columns } from 'react-bulma-components'
import classNames from 'classnames'
import OurHeader from './OurHeader'
import OurFooter from './OurFooter'
import { Link, withRouter, Redirect } from 'react-router-dom'

import React, { useState, useContext, useEffect } from 'react'
import { Button, Content } from 'react-bulma-components'
import axios from 'axios'
import Cookies from 'universal-cookie'
import userContext from '../../context/UserContext'
import { useToasts } from 'react-toast-notifications'


import MatchaModal from '../miscellaneous/Modal'

// Si on veut mettre le projet sur github, ne pas oublier de mettre
// cete key dans un ./env

const PageSkeleton = withRouter(({ location, children }) => {
  const myClasses = classNames({
    homepage: true,
    'image-background': location.pathname === '/',
    'register-background': location.pathname === '/register'
  })

  const [msg, setMsg] = useState([])
  const context = useContext(userContext)
  const { addToast } = useToasts()
  
  // Voir ca demain !!!!
  useEffect(() => {
    if (context.socketIo) {

      context.socketIo.on('notifPrinting', type => {
        addToast(`vous avez un nouveau ${type}`, {
          appearance: 'success',
          autoDismiss: true
        })
      })
    }
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
      .then(() => {
        setMsg(['Mail has been resend, please validate it', 'success'])
      })
      .catch(() => {
        setMsg(['Error, mail has not been sent', 'danger'])
      })
  }

  
  let body = <Columns.Column>{children}</Columns.Column>

  if (context.store.isAuth === true) {
    // quand il est log
    if (context.store.user.verified_mail === false) {
      body = <div>
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
    } else if (context.store.isProfilCompleted === false
        && location.pathname !== '/account'
        && location.pathname !== '/myProfil') {
      body = <Redirect to="account" />
    }
  }

  return (
    <div className='layout-color'>
      <OurHeader />
      <Section className={myClasses}>
        <Container>
          <Columns>
            { body }
            {/*
            context.store.user.verified_mail === false ? (
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
            )
            */}
          </Columns>
        </Container>
      </Section>
      <OurFooter />
    </div>
  )
})

export default withRouter(PageSkeleton)
