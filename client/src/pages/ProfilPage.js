import React from 'react'
import PageSkeleton from '../components/PageSkeleton'
import Sidebar from '../components/SideBar/Sidebar'

function ProfilPage(props) {
  return (
    <div>
      <PageSkeleton>
        <Sidebar />
      </PageSkeleton>
    </div>
  )
}

export default ProfilPage
