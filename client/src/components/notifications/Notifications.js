/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Heading, Button } from 'react-bulma-components'
import { useToasts } from 'react-toast-notifications'

import Profil from '../Profil/Profil'

const Notifications = ({ userInfos, updateUser }) => {
  const [profils, setProfils] = useState([])
  const { addToast } = useToasts()
  const ids = userInfos.notifications.map(notif => notif.user_id)

  useEffect(() => {
    if (userInfos.notifications.length) {
      axios
        .get(`/notifications/users/${ids}`)
        .then(res => {
          if (res.data.length) {
            const newProfils = userInfos.notifications.map(elem => {
              return {
                ...res.data.find(datum => datum.id === elem.user_id),
                notif: { type: elem.type, id: elem.id }
              }
            })
            setProfils(newProfils)
          } else {
            addToast('Aucune nouvelle notification', {
              appearance: 'info',
              autoDismiss: true
            })
          }
        })
        .catch(err => {
          throw err
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfos.notifications])

  const updateProfils = e => {
    const notifId = e.target.getAttribute('notifid')
    axios
      .delete(`notifications/delete/${notifId}`)
      .then(res => {
        if (res.status === 200) {
          const tmpArray = profils.filter(elem => elem.notif.id != notifId)
          setProfils(tmpArray)
          userInfos.notifications = userInfos.notifications.filter(
            elem => elem.id != notifId
          )
          userInfos.nbNotifs -= 1
          updateUser(userInfos)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleDeleteAll = () => {
    const userId = userInfos.id
    axios
      .delete(`/notifications/delete/${userId}/all`)
      .then(res => {
        if (res.status === 200) {
          setProfils([])
          userInfos.notifications = []
          userInfos.nbNotifs = 0
          updateUser(userInfos)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Card className='card-fullwidth'>
      <Card.Content className='notif-card'>
        <Heading size={3} className='has-text-centered title'>
          Notifications
        </Heading>
        {profils.length ? (
          profils.map((profil, index) => {
            return (
              <Profil
                notif
                userInfos={profil}
                fullProfil={false}
                key={index}
                updateNotif={updateProfils}
              />
            )
          })
        ) : (
          <Button disabled fullwidth>
            Aucune nouvelle notifications
          </Button>
        )}
        {userInfos.notifications.length > 0 && (
          <Card.Footer className='notif-footer'>
            <Card.Footer.Item className='notif-footer-item'>
              <Button className='is-size-7' text onClick={handleDeleteAll}>
                Supprimer toutes les notifications
              </Button>
            </Card.Footer.Item>
          </Card.Footer>
        )}
      </Card.Content>
    </Card>
  )
}

export default Notifications
