import React from 'react'
import { Content, Button, Media } from 'react-bulma-components'

function ProfilSearchable({ userInfos }) {
  return (
    <Media>
      <Content>
        <div>
          <h4>username</h4>
          <p>{userInfos.username}</p>
        </div>
        <div>
          <Button>Like</Button>
        </div>
      </Content>
    </Media>
  )
}

export default ProfilSearchable
