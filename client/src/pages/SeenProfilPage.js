import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import Profil from '../components/Profil/Profil'

const SeenProfilPage = withRouter(({ match }) => {
  const { seenId } = match.params
  const [user, setUser] = useState(null)

  useEffect(() => {
    const cookies = new Cookies()
    axios
      .get('/users/getUser/' + seenId, {
        headers: {
          authorization: 'Bearer ' + cookies.get('token')
        }
      })
      .then(resp => {
        if (resp.data) {
          setUser(resp.data)
        }
      })
      .catch(e => {
        console.log('error : ', e)
      })
  }, [seenId])

  if (!user) {
    return <div>Wrong user</div>
  } else {
    return <Profil userInfos={user} />
  }
})

export default SeenProfilPage
