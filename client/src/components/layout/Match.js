import React, { useEffect, useState } from 'react'
import { Button } from 'react-bulma-components'
import axios from 'axios'

function Match({ userId, setCurComponent }) {
  // get all the match for the user Id

  const [match, setMatch] = useState([])

  // c'est ok de mettre ca la comme ca ???
  function deleteMatch(e) {
    if (
      window.confirm(
        'Vous etes sur, vous allez perdre tous vos messages et votre like sera supprimer ?'
      )
    ) {
      const likesId = e.target.getAttribute('data-liked_id')
      axios
        .delete('/match', { data: { userId: userId, likesId: likesId } })
        .then(() => {
          // mettre un toast ??
          setMatch(
            match.filter(elem => {
              return elem[1] != likesId
            })
          )
        })
        .delete('/like/delete', { data: { userId: userId, likesId: likesId } })
        .catch(() => {
          // comment on gere ca ??
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

  if (match) {
    return (
      <div>
        {match.map((elem, index) => {
          return (
            <div key={index}>
              Voici un match : {elem[1]} || Bon pour le moment ca ne renvoie
              qu'un int mais bon, je ne sais pas trop de quoi on aura besoins,
              car la c'est juste des liens vers leurs chats respectifs donc je
              verrai plus tard
              <Button data-liked_id={elem[1]} onClick={e => deleteMatch(e)}>
                Supprimer matchs
              </Button>
              <Button onClick={() => setCurComponent(elem[0])}>
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
