import React from 'react'
import Slide from '../miscellaneous/Slide'
import Moment from 'react-moment'
import 'moment/locale/fr'
import { Card, Media, Image, Heading, Tag } from 'react-bulma-components'

const genderMatching = {
  female: 'femme',
  male: 'homme'
}

const sexeOrientationMatching = {
  female: 'les femmes',
  male: 'les hommes',
  bisexual: 'femmes ou hommes'
}

const UserProfil = ({
  userInfos,
  profilPicture,
  images,
  onlineInfos,
  tags
}) => {
  let onlineDisplay

  if (onlineInfos) {
    onlineDisplay = onlineInfos.is_online ? (
      <p>online</p>
    ) : (
      <span className='is-size-7 profil-online'>
        <p>
          Derniere connexion:&nbsp;
          <Moment fromNow locale='fr' date={onlineInfos.last_connection} />
        </p>
      </span>
    )
  } else onlineDisplay = null

  return (
    <Card className='card-fullwidth'>
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
              @{userInfos.username} ( {genderMatching[userInfos.gender]} )
            </Heading>
          </Media.Item>
        </Media>
        <div className='sexual_orientation is-size-7'>
          Recherche {sexeOrientationMatching[userInfos.sexual_orientation]}
        </div>
        <div className='bio is-size-6'>{userInfos.bio}</div>
        <Tag.Group>
          {tags.map(tag => {
            return (
              <Tag key={tag.id} className='primary-light'>
                #{tag.name}
              </Tag>
            )
          })}
        </Tag.Group>
        <div className='profil-footer'>
          <div className='popularity'>
            popularite : {userInfos.popularity_score} / 100
          </div>
          <div className='profil-last-online is-size-7' dateTime='2016-1-1'>
            {onlineDisplay}
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default UserProfil
