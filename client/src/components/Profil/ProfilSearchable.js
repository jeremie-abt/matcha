import React from 'react'
import { Content, Button, Media } from 'react-bulma-components'

function ProfilSearchable({
  userInfos,
  handleBlocked,
  handleReport,
  handleLike,
  handleUnLike,
  isLiked
}) {
  let likedButton

  if (isLiked) {
    likedButton = (
      <Button
        onClick={() => {
          handleUnLike(userInfos.id)
        }}
        className='liked'
      >
        Like
      </Button>
    )
  } else {
    likedButton = (
      <Button
        onClick={() => {
          handleLike(userInfos.id)
        }}
      >
        Like
      </Button>
    )
  }
  return (
    <Media>
      <Content>
        <div>
          <h4>username</h4>
          <p>{userInfos.username}</p>
        </div>
        <div>
          {likedButton}
          <Button onClick={() => handleBlocked(userInfos.id)}>block</Button>
          <Button id={userInfos.id} onClick={handleReport}>
            report
          </Button>
        </div>
      </Content>
    </Media>
  )
}

export default ProfilSearchable
