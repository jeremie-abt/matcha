import React, { useState } from 'react'
import { Container, Columns } from 'react-bulma-components'

import SideBar from '../components/SideBar'
import PageSkeleton from '../components/layout/PageSkeleton'
import Title from '../components/PageTitle'

// dynamic components
import Profil from '../components/Profil/Profil'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Histo from '../components/Histo'

import socket from '../index'

function UserPage({ userInfos }) {
  const [curComponent, setCurComponent] = useState('profil')

  const componentsMapping = {
    profil: <Profil userInfos={userInfos} />,
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
