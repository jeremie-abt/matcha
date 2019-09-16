import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import Form from '../components/Form/Form'

const fields = [
  
  {
    name: "jean",
    label: "test",
  },
  {
    name: "bonjour",
    label: "prout"
  }
]

class LoginPage extends React.Component {
  render() {
    return (
      <Form fields={fields} />
    )
  }
}

export default LoginPage
