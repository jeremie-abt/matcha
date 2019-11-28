import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

import userContext from '../context/UserContext'

import ProfilSearchable from './Profil/ProfilSearchable'

import FormFilter from './Form/formComponent/FormFilter'

// est ce que c'est appelle
// on est d'accord ce truc n'est jamais appele wtff ??
/*
function Search() {
  const context = useContext(userContext)
  const [profilsComponents, setProfilsComponents] = useState([])

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
*/
