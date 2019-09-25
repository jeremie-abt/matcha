import React from 'react'
// import axios from 'axios'
import FormConstructor from '../FormConstructor'

class FormLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(submittedData) {
    this.setState({ data: submittedData })
    alert('check log')
  }

  render() {
    return (
      <FormConstructor
        fields={this.props.fields}
        handleForm={this.handleSubmit}
      />
    )
  }
}

export default FormLogin
