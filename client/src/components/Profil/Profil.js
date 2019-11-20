import React, { useContext } from 'react'
import { Card, Columns } from 'react-bulma-components'
import userContext from '../../context/UserContext'

//need { ...userInfos } as parameters
function Profil() {
  //need to be deleted

  const context = useContext(userContext)
  const userInfos = context.store.user

  return (
    <Card className='card-fullwidth'>
      <Card.Content className='profil'>
        <Columns centered>
          <Columns.Column>
            <p>yooolooo</p>
            <div className='has-text-centered'>{userInfos.firstname}</div>
          </Columns.Column>
          <Columns.Column className='has-text-centered'>
            {userInfos.lastname}
          </Columns.Column>
        </Columns>
        <Columns>
          <Columns.Column className='has-text-centered'>
            {userInfos.username}
          </Columns.Column>
          <Columns.Column className='has-text-centered'>
            {userInfos.email}
          </Columns.Column>
        </Columns>
        <Columns>
          <Columns.Column className='has-text-centered'>
            {userInfos.age}
          </Columns.Column>
          <Columns.Column className='has-text-centered'>
            {userInfos.sexual_orientation}
          </Columns.Column>
          <Columns.Column className='has-text-centered'>
            {userInfos.gender}
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  )
}

export default Profil
