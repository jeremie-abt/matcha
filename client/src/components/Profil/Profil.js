/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import UserProfil from './UserProfil'
import SearchableProfil from './ProfilSearchable'
import axios from 'axios'

function Profil({
  userInfos,
  event = null,
  fullProfil = true,
  isLiked = null
}) {
  const { addToast } = useToasts()
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [profilPicture, setProfilPicture] = useState(false)
  const [onlineInfos, setOnlineInfos] = useState({})

  useEffect(() => {
    axios
      .get(`/${userInfos.id}/images`)
      .then(result => {
        if (result.data.length) {
          const pImage = result.data.find(elem => elem.is_profil)
          pImage ? setProfilPicture(pImage) : setProfilPicture(result.data[0])
          setImages(result.data)
        }
      })
      .catch(() => {
        errorDuringLoading()
      })
  }, [addToast, userInfos])

  useEffect(() => {
    if (userInfos.tags.length)
      axios
        .get(`/tags/user/${userInfos.id}`)
        .then(result => {
          if (result.data.length) {
            setTags(result.data)
          }
        })
        .catch(err => {
          console.log(err)
          errorDuringLoading()
        })
  }, [addToast, userInfos])

  // fetch isOnline
  useEffect(() => {
    axios.get('/online/' + userInfos.id).then(resp => {
      setOnlineInfos(resp.data)
    })
  }, [])

  function errorDuringLoading() {
    return addToast(
      "Une erreur s'est produite durant le chargement des images",
      {
        appearance: 'error',
        autoDismiss: true
      }
    )
  }
  if (fullProfil) {
    return (
      <UserProfil
        userInfos={userInfos}
        profilPicture={profilPicture}
        images={images}
        tags={tags}
        onlineInfos={onlineInfos}
      />
    )
  } else {
    return (
      <SearchableProfil
        isLiked={isLiked}
        userInfos={userInfos}
        profilPicture={profilPicture}
        event={event}
        tags={tags}
        onlineInfos={onlineInfos}
      />
    )
  }
}

export default Profil
