import React, { useState } from 'react'
import { Container, Columns } from 'react-bulma-components'

import SideBar from '../components/SideBar'
import PageSkeleton from '../components/layout/PageSkeleton'
import Title from '../components/PageTitle'

// dynamic components
import Profil from '../components/Profil/Profil'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Histo from '../components/Histo'

function UserPage({ userInfos }) {
  
  const [curComponent, setCurComponent] = useState('profil')
  const componentsMapping = {
    profil: <Profil userInfos={userInfos} />,
    like: <Histo type="like" />,
    seen: <Histo type="seen" />,
    update: <UpdateForm />
  }
  
  return (
    <PageSkeleton>
      <Title name='User Information' />
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
