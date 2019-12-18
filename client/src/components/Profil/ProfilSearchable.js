import React, { useContext } from 'react'
import userContext from '../../context/UserContext'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import 'moment/locale/fr'
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
      <Moment fromNow locale='fr' date={onlineInfos.last_connection} />
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

  const PhraseNotif = () => {
    const type = userInfos.notif.type
    let message = ''
    if (type === 'like') message = 'aime votre profil !'
    else if (type === 'view') message = 'a vu votre profil'
    else if (type === 'message') message = 'vous a envoyé un message'
    else if (type === 'match') message = 'vient de match avec vous !'
    else if (type === 'unmatch') message = 'Le match est terminer !'

    return <span>{message}</span>
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
              @{userInfos.username} {userInfos.notif ? <PhraseNotif /> : ''}
            </Heading>
          </Media.Item>
          <Media.Item>
            <Button.Group position='right'>
              {printAllButton && likedButton}
              <Link to={'/Profil/' + userInfos.id}>
                <Button color='primary' onClick={disPlayProfil}>
                  Voir le profil
                </Button>
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
            {props.notif && <div>{props.notif.type}</div>}
            {props.notif && (
              <Button
                text
                className='is-size-7'
                notifid={props.notif.id}
                type={props.notif.type}
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
                report
              </Button>
            )}
          </div>
        </Content>
      </Card.Content>
    </Card>
  )
}

export default ProfilSearchable
