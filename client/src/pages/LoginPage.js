import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../components/Form/FormConstructor'

const fields = [
  
  {
    name: "jean",
    label: "test",
    type: "text"
  },
  {
    name: "bonjour",
    label: "prout",
    type: "text"
  },
  {
    name:"tags",
    type: 'checkbox',
    checkboxValues: ["plaisir", "SM", "cuirmoustache"]
  }
]

class LoginPage extends React.Component {
  render() {
    return (
      <FormConstructor fields={fields} />
    )
  }
}

export default LoginPage
