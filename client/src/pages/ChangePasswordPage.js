import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router'
import axios from 'axios'
import FormUpdatePassword from '../components/Form/formComponent/FormUpdatePassword'

function ValidateMail(props) {
  const [formAccess, setFormAccess] = useState(null)

  useEffect(() => {
    const params = props.match.params
    const token = params.token

    axios
      .get('/auth/confirmationMail/' + token, {
        withCredentials: true
      })
      .then(resp => {
        if (resp.status === 200) {
          setFormAccess(true)
        }
      })
      .catch(() => {
        setFormAccess(false)
      })
  }, [props.match.params])

  if (formAccess === true) {
    return <FormUpdatePassword />
  } else if (formAccess === false) {
    return (
      <div>
        <Redirect to='/profil' />
      </div>
    )
  } else return <div>loading ...</div>
}

export default withRouter(ValidateMail)
