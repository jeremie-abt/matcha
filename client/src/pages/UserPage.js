import React, { useState } from 'react'
import { Container, Columns } from 'react-bulma-components'
import { Button, Content } from 'react-bulma-components'
import axios from 'axios'
import Cookies from 'universal-cookie'

import SideBar from '../components/layout/SideBar'
import PageSkeleton from '../components/layout/PageSkeleton'
import Title from '../components/layout/PageTitle'

// component
import MatchaModal from '../components/miscellaneous/Modal'

// dynamic components
import Profil from '../components/Profil/Profil'
import Images from '../components/UserImages/UserImages'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Histo from '../components/Profil/Histo'
import FormFilter from '../components/Form/formComponent/FormFilter'

import socket from '../index'

function UserPage({ userInfos }) {
  const [msg, setMsg] = useState([])
  const [curComponent, setCurComponent] = useState('search')

  const componentsMapping = {
    search: <FormFilter />,
    profil: <Profil userInfos={userInfos} />,
    images: <Images userId={userInfos.id} />,
    like: <Histo type='like' />,
    seen: <Histo type='seen' />,
    update: <UpdateForm />
  }

  // temporary function to try notifications
  // firing multiple times for nothing
  const prout = () => {
    const type = 'view'
    socket.emit('notifSent', {
      userData: { firstname: 'David', lastname: 'Laurent' },
      userId: 3,
      receiverId: 7,
      type,
      socketId: socket.id
    })
  }

  // ca ok de mettre ca la tu penses ?
  const sendNewMail = () => {
    const cookies = new Cookies()
    cookies.remove('mailToken')
    axios
      .post(
        '/auth/sendTokenMail',
        {
          redirectionLink: 'http://localhost:3000/confirmationMail/',
          id: userInfos.id,
          email: userInfos.email
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

  if (userInfos.verified_mail === false) {
    return (
      <div>
        <PageSkeleton>
          {Object.entries(msg).length !== 0 && (
            <MatchaModal
              color={msg[1]}
              msg={msg[0]}
              setMsg={setMsg}
            ></MatchaModal>
          )}
          <Content>
            <h1>You must confirm your mail</h1>
            <Button onClick={sendNewMail}>Click here to send new Mail</Button>
          </Content>
        </PageSkeleton>
      </div>
    )
  }
  return (
    <PageSkeleton>
      <Title name='User Information' />
      {/* temporary button to try notifications */}
      <button onClick={prout}>yolo</button>
      <Container className='user-container'>
        <Columns>
          <Columns.Column size='one-third'>
            <SideBar
              curComponent={curComponent}
              setCurComponent={setCurComponent}
            />
          </Columns.Column>
          <Columns.Column>{componentsMapping[curComponent]}</Columns.Column>
        </Columns>
      </Container>
    </PageSkeleton>
  )
}

export default UserPage
