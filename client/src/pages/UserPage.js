import React, { useState } from 'react'

import { Columns } from 'react-bulma-components'

import SideBar from '../components/SideBar'
import PageSkeleton from '../components/PageSkeleton'

// dynamic components
import Profil from '../components/Profil'
import UpdateForm from '../components/Form/formComponent/FormUpdateProfil'
import Like from '../components/LikeHisto'

function UserPage() {
  const [curComponent, setCurComponent] = useState("profil")
  const componentsMapping = {
    "profil": <Profil/>,
    "like": <Like/>,
    "update": <UpdateForm />
  }


  /// avance un max sur la user page
  // mecanisme de component qui change
  // un max de linkage
  // 
  console.log("Bojnour voici la value : ", curComponent)
  return (
    <PageSkeleton>
      <Columns>
        <Columns.Column size={4}>
          <SideBar handleClick={setCurComponent}/>
        </Columns.Column>
        <Columns.Column>
          {componentsMapping[curComponent]}
        </Columns.Column>
      </Columns>
    </PageSkeleton>
  )
}

export default UserPage
