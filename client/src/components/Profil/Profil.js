import React from 'react'
import { Card, Container, Columns } from 'react-bulma-components'

//need { ...userInfos } as parameters
function Profil() {
  //need to be deleted
  const userInfos = {
    age: 18,
    bio: '',
    birthdate: null,
    email: 'test@gmail.com',
    firstname: 'jabt',
    gender: 'female',
    id: 7,
    lastname: 'non',
    localisation: '',
    online: false,
    password:
      '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    popularity_score: 0.5,
    sexual_orientation: 'bisexual',
    tags: null,
    username: 'jabt',
    verified_mail: false
  }

  return (
    <Card className='card-profil'>
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
