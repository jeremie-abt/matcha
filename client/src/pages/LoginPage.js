import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import Form, {Counter} from '../components/Form/Form'
//import {Counter} from '..components/Form/Form'

const fields = [
  {
    name: "firstname",
    type: "text",
    label: "Label firstname"
  },
  {
    name:"jean",
    type: "text",
    label: "Label firstname",
    event: ["onChange"]
  },
  {
    name: "submit",
    type: "submit",
  }
]

class LoginPage extends React.Component {
  render() {
    return (

      //<Counter initialCount={5} />
      <Form fields={fields} />
    )
  }
}

export default LoginPage
