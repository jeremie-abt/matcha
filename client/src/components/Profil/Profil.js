import React from 'react'

import UserContext from '../../context/UserContext'
import ProfilCard from './ProfilCard'

function Profil() {

  return (
    <UserContext.Consumer>
      {
        context => {
          
          return <ProfilCard {...context.store.user} />

          /*return Object.entries(context.store.user).map(([key, val]) => {
            return (
              <div>
                <p>{key} : {val}</p>
              </div>
            )
          })*/
          
        }
      }
      

    </UserContext.Consumer>
  )
}

export default Profil
