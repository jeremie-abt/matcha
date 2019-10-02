import React, { useState } from 'react'

import { Container, Columns, Heading } from 'react-bulma-components'

import SideBar from '../components/SideBar'
import PageSkeleton from '../components/PageSkeleton'

// dynamic components
import Profil from '../components/Profil'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Like from '../components/LikeHisto'

function UserPage() {
  const [curComponent, setCurComponent] = useState('profil')
  const componentsMapping = {
    profil: <Profil />,
    like: <Like />,
    update: <UpdateForm />
  }

  console.log('Bonjour voici la value : ', curComponent)
  return (
    <PageSkeleton>
      <Heading>Informations User</Heading>
      <Container>
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
