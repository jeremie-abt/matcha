import React from 'react'
import Slide from '../miscellaneous/Slide'
import {
  Card,
  Media,
  Image,
  Heading,
  Content,
  Tag,
  Button
} from 'react-bulma-components'

const UserProfil = ({ userInfos, profilPicture, images, tags, ...other }) => {
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
            11:09 PM - 1 Jan 2016
            {/* need last time online or online */}
          </div>
        </Content>
        <Tag.Group>
          {tags.map(tag => {
            return (
              <Tag size='medium' key={tag.id} color='primary'>
                #{tag.name}
              </Tag>
            )
          })}
        </Tag.Group>
        {
          other.isMatch &&
          <Button
            onClick={() => other.setCurComponent([other.roomId, userInfos.id])}>
              Bouton chat
          </Button>
        }
        {
          other.isMatch && 
          <Button
            data-liked_id={userInfos.id}
            onClick={e => other.deleteMatch(e)}>
            Supprimer matchs
          </Button>
        }

      </Card.Content>
    </Card>
  )
}

export default UserProfil
