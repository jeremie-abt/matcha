import React from 'react'

import { Card, Media, Heading } from 'react-bulma-components'

function ProfilCard( {...userInfos} ) {
  
  return (
    <Card>
      <Card.Image src={
          require("../../assets/img/defaultProfil.jpg")
       } />
       <Card.Content>
        <Media>
          <Media.Item position="left">
            <Heading > 
              {userInfos.firstname} {userInfos.lastname}
            </Heading>            
          </Media.Item>
          <Media.Item>
            {userInfos.bio}
          </Media.Item>
        </Media>
       </Card.Content>
    </Card>
  )
}

export default ProfilCard
