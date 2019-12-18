import React, { useEffect, useState, useContext } from 'react'
import userContext from '../../context/UserContext'
import { Button, Card, Heading } from 'react-bulma-components'
import axios from 'axios'
import Profil from '../Profil/Profil'

const Match = () => {
  // get all the match for the user Id

  const [match, setMatch] = useState([])
  const context = useContext(userContext)
  const userId = context.store.user.id

  // c'est ok de mettre ca la comme ca ???
  function deleteMatch(e) {
    if (
      window.confirm(
        'Vous etes sur, vous allez perdre tous vos messages et votre like sera supprimer ?'
      )
    ) {
      const likesId = e.target.getAttribute('data-liked_id')
      context.socketIo.emit('notifSent', {
        userId: context.store.user.id,
        receiverId: likesId,
        type: 'unmatch'
      })

      axios
        .delete('/match', { data: { userId: userId, likesId: likesId } })
        .then(() => {
          // mettre un toast ??
          setMatch(
            match.filter(elem => {
              return elem[0].id !== parseInt(likesId, 10)
            })
          )
          return axios.delete('/like/delete', {
            data: { userId: userId, likesId: likesId }
          })
        })
        .catch(e => {
          console.log('there has been an error : ', e)
        })
    }
  }

  useEffect(() => {
    axios
      .get('/match/' + parseInt(userId, 10))
      .then(resp => {
        setMatch(resp.data)
      })
      .catch(e => {
        console.log('error : ', e)
      })
  }, [userId])

  useEffect(() => {
    context.socketIo.on('unmatchEmit', id => {
      const newMatch = match.filter(elem => elem[1] !== id)
      setMatch(newMatch)
    })
  }, [context.socketIo, match])

  return (
    <Card className='card-fullwidth'>
      <Card.Content className='notif-card'>
        <Heading size={3} className='has-text-centered title'>
          Matchs
        </Heading>
        {match && match.length > 0 ? (
          <div>
            {match.map((elem, index) => {
              return (
                <Profil
                  userInfos={elem[0]}
                  roomId={elem[1]}
                  event={{ deleteMatch }}
                  isMatchProfil
                  fullProfil={false}
                  key={index}
                />
              )
            })}
          </div>
        ) : (
          <Button disabled fullwidth>
            Aucune Matchs actuellement
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}

export default Match
