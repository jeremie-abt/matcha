import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

import userContext from '../context/UserContext'

import ProfilSearchable from './Profil/ProfilSearchable'

import FormFilter from './Form/formComponent/FormFilter'

function Search() {
  const context = useContext(userContext)
  const [profilsComponents, setProfilsComponents] = useState([])

  /*useEffect(() => {
    axios
      .post('/users/search', { userInfos: context.store.user })
      .then(resp => {
        const newProfils = []
        resp.data.forEach((element, key) => {
          newProfils.push(<ProfilSearchable key={key} userInfos={element} />)
        })
        setProfilsComponents(newProfils)
      })
  }, [context.store.user])*/

  return (
    <div>
      <FormFilter />
      {(Object.entries(profilsComponents).length === 0 && (
        <div>Loading ...</div>
      )) ||
        profilsComponents.map(element => {
          return element
        })}
    </div>
  )
}

export default Search
