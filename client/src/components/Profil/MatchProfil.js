import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import {
  Content,
  Card,
  Button,
  Media,
  Image,
  Tag,
  Heading
} from 'react-bulma-components'

const MatchProfil = ({
  userInfos,
  tags,
  profilPicture,
  event,
  onlineInfos,
  ...props
}) => {
  let onlineDisplay

  if (onlineInfos) {
    onlineDisplay = onlineInfos.is_online ? (
      <p>online</p>
    ) : (
      <Moment fromNow locale='fr' date={onlineInfos.last_connection} />
    )
  } else onlineDisplay = null

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
              <Button data-liked_id={userInfos.id} onClick={event.deleteMatch}>
                Supprimer le Match
              </Button>
              <Link
                to={{
                  pathname: '/chat',
                  state: {
                    roomId: props.roomId,
                    idToSend: userInfos.id
                  }
                }}
                className='navbar-item'
              >
                chat
              </Link>
            </Button.Group>
          </Media.Item>
        </Media>
        <Tag.Group>
          {!props.notif
            ? tags.map(tag => {
                return (
                  <Tag key={tag.id} className='primary-light'>
                    #{tag.name}
                  </Tag>
                )
              })
            : ''}
        </Tag.Group>
        <Content className='profil-last-online is-size-7'>
          <div className='profil-last-line' dateTime='2016-1-1'>
            {onlineDisplay}
          </div>
        </Content>
      </Card.Content>
    </Card>
  )
}

export default MatchProfil
