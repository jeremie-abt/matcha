import React from 'react'
import PageSkeleton from '../components/PageSkeleton'
import Sidebar from '../components/SideBar/Sidebar'
import UserContext from '../context/UserContext'

function ProfilPage() {

  return (
    <div>
      <UserContext.Consumer>
        {
          context => (console.log('context', context))
        }
      </UserContext.Consumer>
      <PageSkeleton>
        <Sidebar />
      </PageSkeleton>

    </div>
  )
}

export default ProfilPage
