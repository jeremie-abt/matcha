/* eslint-disable eqeqeq */
import React, { useEffect, useState, useContext } from 'react'
import userContext from '../../context/UserContext'
import axios from 'axios'
import { Card, Heading, Button } from 'react-bulma-components'
import Cookies from 'universal-cookie'

import Profil from '../Profil/Profil'

const Notifications = ({ userInfos, updateUser }) => {
  // pourquoi on a besoin de ces deux la ???

  const context = useContext(userContext)
  const [profils, setProfils] = useState({})
  const [notifs, setNotifs] = useState([])
  //const [noNotifs, setNoNotifs] = useState(false)

  // alors en vraie je vais refetch tous les profils, pourquoi ->
  // deja parceque sinon si on essaye de les garder en cache
  // et de les recup depuis le front on va avoir des beugs
  // c'est possible quun mec ne soit pas charge en front dans la 
  // search mais soit dans les notifs -> beug
  useEffect(() => {
    
    const cookies = new Cookies()

    axios.get('/notifications/' + context.store.user.id)
    .then(resp => {
      if (resp.data.length > 0){
        setNotifs(resp.data)
        // return une promise
        let ret = []
        // je construit un tableau d'id quil faut fetch
        // pour fetch uniquement les users qui ne sont pas deja charge
        resp.data.forEach(elem => {
          if (!Object.keys(profils).includes(elem.user_id) &&
              !ret.includes(elem.user_id)) {
            ret.push(elem.user_id)
          }
        })
        if (ret.length > 0) {
          const promises = []
          ret.forEach(elem => {
            const currentPromise = axios
            .get('/users/getUser/' + elem, {
              headers: {
                authorization: 'Bearer ' + cookies.get('token')
              }
            })
            promises.push(currentPromise)
          })
          return Promise.all(promises)
        }
      }
    })
    .then(resp => {
      if (resp) {
        const newProfils = {}
        resp.forEach(elem => {
          newProfils[elem.data.id] = elem.data
        })
        setProfils({...profils, ...newProfils})
      }
    })
    .catch(e => {
      console.log("e : ", e)
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.store.user.nbNotifs])


  // avoir une fois le premier fix fait
  const updateProfils = e => {
    const notifId = e.target.getAttribute('notifid')
    axios
      .delete(`notifications/delete/${notifId}`)
      .then(res => {
        if (res.status === 200) {
          const tmpArray = notifs.filter(elem => elem.id != notifId)
          setNotifs(tmpArray)
          userInfos.nbNotifs -= 1
          updateUser(userInfos)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleDeleteAll = () => {
    const userId = context.store.user.id
    axios
      .delete(`/notifications/delete/${userId}/all`)
      .then(res => {
        if (res.status === 200) {
          setProfils({})
          setNotifs([])
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
        {
          notifs.length ? (
            notifs.map((notif, index) => {
              if (notif.user_id in profils) {
                return (
                  <Profil
                  notif={notif}
                  userInfos={profils[notif.user_id]}
                  fullProfil={false}
                  key={index}
                  updateNotif={updateProfils}
                  />
                  )
              } else {
                return <div key={index}>loading ...</div>
              }
            })
          ) : (
            <Button disabled fullwidth>
              Aucune nouvelle notifications
            </Button>
        )}
        {notifs.length > 0 && (
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
