import React, { useState } from 'react'
import { Content, Button, Media } from 'react-bulma-components'

function ProfilSearchable({
  userInfos,
  handleBlocked,
  handleReport,
  handleLike,
  handleUnLike,
  isLiked
}) {
  const [stateIsLiked, setStateIsLiked] = useState(isLiked)
  let likedButton

  if (stateIsLiked) {
    likedButton = (
      <Button
        onClick={() => {
          handleUnLike(userInfos.id)
          setStateIsLiked(stateIsLiked ? false : true)
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
          setStateIsLiked(stateIsLiked ? false : true)
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
