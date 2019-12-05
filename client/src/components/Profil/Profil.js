/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import UserProfil from './UserProfil'
import axios from 'axios'

function Profil({ userInfos, ...other }) {
  const { addToast } = useToasts()
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [profilPicture, setProfilPicture] = useState(false)

  useEffect(() => {
    axios
      .get(`/${userInfos.id}/images`)
      .then(result => {
        if (result.data.length) {
          const pImage = result.data.find(elem => elem.is_profil)
          pImage ? setProfilPicture(pImage) : setProfilPicture(result.data[0])
          setImages(result.data)
        } else {
          addToast('Aucune images disponibles', {
            appearance: 'info',
            autoDismiss: true
          })
        }
      })
      .catch(() => {
        errorDuringLoading()
      })
  }, [addToast, userInfos])

  useEffect(() => {
    axios
      .get(`/tags/user/${userInfos.id}`)
      .then(result => {
        if (result.data.length) setTags(result.data)
        else {
          addToast('Auncun Tags sélectionnés', {
            appearance: 'info',
            autoDismiss: true
          })
        }
      })
      .catch(err => {
        console.log(err)
        errorDuringLoading()
      })
  }, [addToast, userInfos])

  function errorDuringLoading() {
    return addToast(
      "Une erreur s'est produite durant le chargement des images",
      {
        appearance: 'error',
        autoDismiss: true
      }
    )
  }
  return (
    <UserProfil
      userInfos={userInfos}
      profilPicture={profilPicture}
      images={images}
      tags={tags}
      {...other}
    />
  )
}

export default Profil
