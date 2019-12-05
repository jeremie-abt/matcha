import React, { useEffect, useState, useContext } from 'react'
import userContext from '../../context/UserContext'
import axios from 'axios'
import { Button } from 'react-bulma-components'
//import Profil from '../../components/Profil/Profil'

function Match({ userId, setCurComponent }) {
  // get all the match for the user Id

  const [match, setMatch] = useState([])
  const context = useContext(userContext)

  // c'est ok de mettre ca la comme ca ???
  function deleteMatch(e) {
    if (
      window.confirm(
        'Vous etes sur, vous allez perdre tous vos messages et votre like sera supprimer ?'
      )
    ) {
      const likesId = e.target.getAttribute('data-liked_id')
      console.log('liikes Id : ', likesId)
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
        /*.then(resp => {
          
        })*/
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

  if (match) {
    return (
      <div>
        {match.map((elem, index) => {
          return (
           /* <Profil
              roomId={elem[1]}
              Matched={elem[0].id}
              isMatch={true}
              setCurComponent={setCurComponent}
              deleteMatch={deleteMatch}
              userInfos={elem[0]}
              key={index}
            />
*/
            <div key={index}>
              Voici un match : {elem[0].id} || Bon pour le moment ca ne renvoie
              qu'un int mais bon, je ne sais pas trop de quoi on aura besoins,
              car la c'est juste des liens vers leurs chats respectifs donc je
              verrai plus tard
              <Button data-liked_id={elem[0].id} onClick={e => deleteMatch(e)}>
                Supprimer matchs
              </Button>
              
              <Button onClick={() => setCurComponent([elem[1], elem[0].id])}>
                Click for chat
              </Button>
              <br />
              <br />
              <br />
            </div>
          )
        })}
      </div>
    )
  } else {
    return (
      <div>
        Non tu n'as pas de match, pour augmenter ta visibilite tu peux me
        contacter par mail abtjeremie@gmail.com et me faire un virement de 2500
        euros pour avoir la version gold-premium++, et la tu auras pleins de
        match, a toi de voir mon pote !
      </div>
    )
  }
}

export default Match
