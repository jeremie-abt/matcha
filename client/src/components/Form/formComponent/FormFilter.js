/* eslint-disable eqeqeq */
import React, { useEffect, useState, useContext, useRef } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import { Card, Heading } from 'react-bulma-components'
import { useToasts } from 'react-toast-notifications'
import { getDistance } from 'geolib'
import Cookies from 'universal-cookie'

import userContext from '../../../context/UserContext'
import Profil from '../../../components/Profil/Profil'
import ReportModal from '../../miscellaneous/ReportModal'

const fields = [
  {
    name: 'maxAge',
    label: 'age',
    type: 'range',
    range: [18, 98],
    defaultValues: [18, 45]
  },
  {
    name: 'maxScore',
    label: 'score',
    type: 'range',
    range: [0, 10],
    defaultValues: [1, 6]
  },
  {
    name: 'maxDistance',
    label: 'maxDistance',
    type: 'slider',
    defaultValue: 80
  },
  {
    name: 'tags',
    title: 'Tags',
    type: 'checkbox',
    checkboxValues: []
  },
  {
    name: 'sexual_orientation',
    title: 'sexual orientation',
    type: 'radio',
    radioValues: ['female', 'male', 'bisexual']
  }
]

// function used for the sorting
function FormFilter() {
  const { addToast } = useToasts()
  const context = useContext(userContext)
  const [inputs, setInputs] = useState(fields)
  const [showModal, setShowModal] = useState(false)
  const [reportedId, setReportedId] = useState(false)
  const [profils, setProfils] = useState([])
  const [filters, setFilters] = useState({})
  const [liked, setLiked] = useState([])
  // useeffect avec un state qui cree juste un tab avec tous les id liked
  // -> ensuite mon profile searchable get une var false ou true pour savoir s'il
  // le type est liked

  // modif -> utilisation de useRef, car ce truc la ne doit jamais update ma
  // page visuellement
  const userWhoLikedMe = useRef([])

  function _calculateScore(a, b) {
    let aScore

    if (a.score && b.score) aScore = a.score - b.score
    else aScore = 0
    context.store.user.tags.forEach(elem => {
      if (a.tags && a.tags.includes(elem)) {
        aScore += 2
      }
    })
    aScore += Math.round(a.popularity_score / 15)
    return aScore
  }

  /**
   *
   * @param {array} profils
   */
  function _sortProfil(a, b) {
    // if return 0 b est classe avant

    let aFinalScore = _calculateScore(a, b)
    let bFinalScore = _calculateScore(b, a)

    if (aFinalScore > bFinalScore) {
      return -1
    } else if (aFinalScore < bFinalScore) {
      return 1
    } else return 0
  }

  // setting the state correctly
  useEffect(() => {
    const filtersObj = {}
    fields.forEach(elem => {
      if (elem.type === 'range') {
        filtersObj[elem.name] = elem.defaultValues
      } else if (elem.type === 'slider') {
        filtersObj[elem.name] = elem.defaultValue
      }
    })
    setFilters(filtersObj)
  }, [])

  useEffect(() => {
    axios
      .get('/tags/all')
      .then(resp => {
        const newData = [...fields]
        let input = newData.find(elem => elem.name === 'tags')
        input.checkboxValues = resp.data
        setInputs(newData)
      })
      .catch(e => {
        console.log('le catch : ', e)
      })
  }, [])

  // enfaite c'est pour capter l'event ou on me like et mettre a jour mon state
  // de gens qui m'ont like sinon ca fait beug les likes
  useEffect(() => {
    // faudra faire une refonte de ca pour avoir un event pour chaque type
    // (like / seen etc ..), et pour l'event like du coup il faudra
    // envoyer lid du mec qui a like comme ca pas besoins de refaire une full requette sql
    context.socketIo.on('likesEmit', likerId => {
      userWhoLikedMe.current.push(likerId)
    })
    context.socketIo.on('unlikesEmit', likerId => {
      let index = userWhoLikedMe.current.indexOf(likerId)
      if (index != -1) {
        userWhoLikedMe.current.splice(index, 1)
      }
    })
  }, [context.socketIo, context.store.user.id])

  // set the state for liked
  useEffect(() => {
    axios
      .get('/like/getLiked/' + context.store.user.id)
      .then(resp => {
        setLiked([...resp.data])
      })
      .catch(e => {
        console.log('\n\nCannot get Liked : \n\n', e)
      })
    axios
      .get('/like/' + context.store.user.id)
      .then(resp => {
        userWhoLikedMe.current = resp.data.map(elem => elem.id)
      })
      .catch(e => {
        console.log('error : ', e)
      })
  }, [context.store.user.id])

  // a voir si faut faire la memoization ca me semble bizarre tout de meme
  function fetchProfils(userInfos) {
    const cookies = new Cookies()
    const token = cookies.get('token')
    axios
      .get('/search', {
        params: userInfos,
        headers: {
          authorization: 'Bearer ' + token
        }
      })
      .then(resp => {
        const profils = resp.data
        if (userInfos.lat && userInfos.long) {
          profils.forEach(profil => {
            // 7 200 000 -> 2 heures because it is in milisec
            // 2 * 60 * 60 * 1000
            if (
              profil.is_online ||
              new Date() - new Date(profil.last_connection) <= 43200000
            ) {
              // c'est ma condition pour les moins de 2 heures !
              // il faut test !!!
              const distance = getDistance(
                { lat: userInfos.lat, lng: userInfos.long },
                { lat: profil.lat, lng: profil.long }
              )
              profil.localisation = distance / 1000
            }
          })
          setProfils(profils)
        }
      })
      .catch(e => {
        console.log('aie ', e)
      })
  }

  useEffect(() => {
    fetchProfils(context.store.user)
  }, [context.store.user])

  function handleSubmit({ state }) {
    const newState = Object.assign({}, context.store.user, state)
    fetchProfils(newState)
  }

  function handleChange({ state }) {
    // Atention en vraie ca va beaucoup rerender
    setFilters(state)
  }

  function updateProfils(id) {
    const tmpArray = profils.filter(elem => elem.id != id)
    setProfils(tmpArray)
  }

  function handleUnLike(likesId) {
    axios
      .delete('/like/delete', {
        data: { userId: context.store.user.id, likesId: likesId }
      })
      .then(() => {
        if (userWhoLikedMe.current.includes(likesId)) {
          context.socketIo.emit('notifSent', {
            userId: context.store.user.id,
            receiverId: likesId,
            type: 'unmatch'
          })
        }
        let newLikedProfils = [...liked]
        newLikedProfils = newLikedProfils.filter(elem => elem !== likesId)
        setLiked(newLikedProfils)
      })
      .catch(e => {
        console.log("Voici l'erreur : ", e)
      })
    // unmatch, en vraie
    // attention ca peut poser des problemes quand tu clic sur un chat !
    axios.delete('/match', { data: { userId: context.store.user.id, likesId } })
  }

  function handleLike(likesId) {
    // e -> recuperer l'id de lautre mec
    // mon current id se trouve dans le context

    axios
      .post('/like/add', {
        userId: context.store.user.id,
        likesId
      })
      .then(resp => {
        if (resp) {
          // faire en sorte de set un state
          let newLikedProfils = [...liked]
          newLikedProfils.push(likesId)
          setLiked(newLikedProfils)
          context.socketIo.emit('notifSent', {
            userId: context.store.user.id,
            receiverId: likesId,
            type: 'like'
          })
          if (userWhoLikedMe.current.includes(likesId)) {
            return axios.post('/match', {
              user1: context.store.user.id,
              user2: likesId
            })
          }
        }
      })
      .then(resp => {
        if (resp) {
          // send notif for match
          context.socketIo.emit('notifSent', {
            userId: context.store.user.id,
            receiverId: likesId,
            type: 'match'
          })
          addToast(`c'est un match, peut etre que tu vas trouver l'amour !`, {
            appearance: 'success',
            autoDismiss: true
          })
        }
      })
      .catch(e => {
        console.log('Voir comment manage les erreurs !', e)
      })
  }

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Heading size={3} className='has-text-centered'>
          Search
        </Heading>
        <FormConstructor
          fields={inputs}
          handleForm={handleSubmit}
          handleChange={handleChange}
        />
        {profils
          .filter(elem => {
            if ('localisation' in elem) {
              let isFalse = false
              Object.keys(filters).forEach(filter => {
                // eslint-disable-next-line default-case
                if (filter.startsWith('max')) {
                  const filterName = filter.split('max')[1].toLowerCase()

                  if (elem[filterName]) {
                    if (Array.isArray(filters[filter])) {
                      const boundaries = filters[filter]
                      if (
                        elem[filterName] < boundaries[0] ||
                        elem[filterName] > boundaries[1]
                      ) {
                        isFalse = true
                      }
                    } else {
                      if (elem[filterName] > filters[filter]) {
                        isFalse = true
                      }
                    }
                  }
                }
              })
              return !isFalse
            }
            return false
          })
          .sort(_sortProfil)
          .map((elem, index) => {
            return (
              <Profil
                fullProfil={false}
                isLiked={liked.includes(elem.id)}
                userInfos={elem}
                event={{
                  setShowModal,
                  setReportedId,
                  handleUnLike,
                  handleLike
                }}
                key={index}
              />
            )
          })}
        {showModal && (
          <ReportModal
            userId={context.store.user.id}
            reportedId={reportedId}
            show={showModal}
            setShowModal={setShowModal}
            updateProfils={updateProfils}
          />
        )}
      </Card.Content>
    </Card>
  )
}

export default FormFilter
