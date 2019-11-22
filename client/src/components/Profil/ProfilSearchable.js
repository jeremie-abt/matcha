import React from 'react'
import { Content, Button, Media } from 'react-bulma-components'

function ProfilSearchable({ userInfos, handleBlocked }) {
  return (
    <Media>
      <Content>
        <div>
          <h4>username</h4>
          <p>{userInfos.username}</p>
        </div>
        <div>
          <Button>Like</Button>
          <Button id={userInfos.id} onClick={handleBlocked}>
            block
          </Button>
        </div>
      </Content>
    </Media>
  )
}

export default ProfilSearchable
