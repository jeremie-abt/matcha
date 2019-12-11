import React from 'react'
import { withRouter } from 'react-router-dom'

const SeenProfil = withRouter(({ history }) => {

  const { seenId } = history.params
  // gerer le cas ou il n'y a pas de seenId
  return (
    <div>bonjour je suis le user profil</div>
  )
})

export default SeenProfil
