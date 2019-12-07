import React from 'react'
import Slide from '../miscellaneous/Slide'
import Moment from 'react-moment'
import {
  Card,
  Media,
  Image,
  Heading,
  Content,
  Tag,
} from 'react-bulma-components'

const UserProfil = ({ userInfos, profilPicture, images, onlineInfos, tags }) => {
  let onlineDisplay

  if (onlineInfos) {
    onlineDisplay = onlineInfos.is_online ? <p>online</p> :
      <Moment fromNow date={onlineInfos.last_connection} />
  } else onlineDisplay = null

  return (
    <Card>
      {images.length > 0 && (
        <div className='slide'>
          <Slide images={images} />
        </div>
      )}
      <Card.Content>
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
        </Media>
        <Content>
          {userInfos.bio}
          <a href='#2'>#responsive</a>
          <div className='profil-last-online' dateTime='2016-1-1'>
            { onlineDisplay }
          </div>
        </Content>
        <Tag.Group>
          {tags.map(tag => {
            return (
              <Tag key={tag.id} className='primary-light'>
                #{tag.name}
              </Tag>
            )
          })}
        </Tag.Group>
      </Card.Content>
    </Card>
  )
}

export default UserProfil
