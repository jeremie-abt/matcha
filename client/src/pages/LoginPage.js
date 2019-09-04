import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import { Button } from 'react-bulma-components'


class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <h1> YOlo c'est le login </h1>
        <Button color="primary">
          bonjour
        </Button>
      </div> 
    )
  }
}

export default LoginPage