import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Heading } from 'react-bulma-components'
import { useToasts } from 'react-toast-notifications'

import Profil from '../Profil/Profil'

const Notifications = ({ userInfos, updateUser }) => {
  const [profils, setProfils] = useState([])
  const addToast = useToasts()
  const ids = userInfos.notifications.map(notif => notif.user_id)

  useEffect(() => {
    axios
      .get(`/notifications/users/${ids}`)
      .then(res => {
        if (res.data.length) {
          setProfils(res.data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateProfils = () => {
    console.log(profils)
    // axios
    //   .put('notification/update', { notifId })
    //   .then(res => {
    //     const tmpArray = profils.filter(elem => elem.id != notifId)
    //     setProfils(tmpArray)
    //     userInfos.notifications = profils
    //     updateUser(userInfos)
    //   })
    //   .catch(() => {
    //     addToast('Une erreur est survenue', {
    //       appearance: 'error',
    //       autoDismiss: true
    //     })
    //   })
  }

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Heading size={3} className='has-text-centered title'>
          Notifications
        </Heading>
        {profils.length &&
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
          })}
      </Card.Content>
    </Card>
  )
}

export default Notifications
