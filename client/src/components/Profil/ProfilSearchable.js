import React, { useContext } from 'react'
import userContext from '../../context/UserContext'
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
import axios from 'axios'

function ProfilSearchable({
  userInfos,
  tags,
  profilPicture,
  event,
  isLiked,
  onlineInfos,
  ...props
}) {
  const context = useContext(userContext)
  let likedButton = null
  let printAllButton = false
  let onlineDisplay

  if (!event) {
    event = {
      handleLike: Function.prototype,
      handleReport: Function.prototype,
      handleUnlike: Function.prototype,
      handleBlocked: Function.prototype
    }
  } else {
    printAllButton = true
  }

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

  if (onlineInfos) {
    onlineDisplay = onlineInfos.is_online ? (
      <p>online</p>
    ) : (
      <Moment fromNow date={onlineInfos.last_connection} />
    )
  } else onlineDisplay = null

  const disPlayProfil = () => {
    axios
      .post('/seen', { userId: context.store.user.id, seenId: userInfos.id })
      .then(resp => {
        context.socketIo.emit('notifSent', {
          userId: context.store.user.id,
          receiverId: userInfos.id,
          type: 'seen'
        })
      })
      .catch(e => {
        console.log('Beug du seen : ', e)
      })
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
              {printAllButton && likedButton}
              <Button color='primary' onClick={disPlayProfil}>
                Voir le profil
              </Button>
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
            {props.notif && (
              <Button
                text
                className='is-size-7'
                notifid={userInfos.notif.id}
                type={userInfos.notif.type}
                onClick={props.updateNotif}
              >
                Supprimer la notification
              </Button>
            )}
            {onlineDisplay}

            {printAllButton && (
              <Button
                id={userInfos.id}
                size='small'
                text={true}
                onClick={() => {
                  event.setShowModal(true)
                  event.setReportedId(userInfos.id)
                }}
              >
                Report
              </Button>
            )}
          </div>
        </Content>
      </Card.Content>
    </Card>
  )
}

export default ProfilSearchable
