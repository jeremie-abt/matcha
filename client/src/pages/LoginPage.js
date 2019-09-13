import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import Form from '../components/Form/Form'
//import {Counter} from '..components/Form/Form'

const fields = [
  
  {
    name: "jean",
    label: "test",
    event: ["onChange"]
  },
  {
    name: "bonjour",
    label: "prout"
  },
  {
    type: "submit",
    event: ["onClick"]
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
