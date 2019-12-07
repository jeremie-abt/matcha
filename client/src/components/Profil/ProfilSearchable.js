import React from 'react'
import {
  Content,
  Card,
  Button,
  Media,
  Image,
  Tag,
  Heading
} from 'react-bulma-components'

function ProfilSearchable({ userInfos, tags, profilPicture, event, isLiked }) {
  let likedButton

  if (isLiked) {
    likedButton = (
      <Button
        onClick={() => {
          event.handleUnLike(userInfos.id)
        }}
        className='liked'
      >
        <span className='icon'>
          <i className='fas fa-heart'></i>
        </span>
        Like
      </Button>
    )
  } else {
    likedButton = (
      <Button
        onClick={() => {
          event.handleLike(userInfos.id)
        }}
      >
        <span className='icon myicon'>
          <i className='far fa-heart'></i>
        </span>
        Like
      </Button>
    )
  }
  return (
    <Card className='profil-card'>
      <Card.Content className='profil-content'>
        <Media>
          <Media.Item renderAs='figure' position='left'>
            {profilPicture ? (
              <Image size={64} alt='64x64' src={profilPicture.url} />
            ) : (
              <span />
            )}
          </Media.Item>
          <Media.Item>
            <Heading size={4}>
              {userInfos.firstname} {userInfos.lastname}
            </Heading>
            <Heading subtitle size={6}>
              @{userInfos.username}
            </Heading>
          </Media.Item>
          <Media.Item>
            <Button.Group position='right'>
              {likedButton}
              <Button color='primary'>Voir le profil</Button>
            </Button.Group>
          </Media.Item>
        </Media>
        <Tag.Group>
          {tags.map(tag => {
            return (
              <Tag key={tag.id} className='primary-light'>
                #{tag.name}
              </Tag>
            )
          })}
        </Tag.Group>
        <Content className='profil-last-online is-size-7'>
          <div className='profil-last-line' dateTime='2016-1-1'>
            Last connection: 11:09 PM - 1 Jan 2016
            {/* need last time online or online */}
            <Button
              id={userInfos.id}
              size='small'
              text={true}
              onClick={() => {
                event.setShowModal(true)
                event.setReportedId(userInfos.id)
              }}
            >
              report
            </Button>
          </div>
        </Content>
      </Card.Content>
    </Card>
  )
}

export default ProfilSearchable
