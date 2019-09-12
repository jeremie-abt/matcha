import React from 'react'
import { Form, Button } from 'react-bulma-components'

/**
 * Dalauren's old login form
 */



class LoginForm extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangeUsername = this.handleChangeUsername.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  handleChangeUsername(e) {
    this.setState({ username: e.target.value })
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value })
  }

  handleSubmit(e) {
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <Form.Field>
          <Form.Label>
            ENORME ET SEC
          </Form.Label>
          <Form.Control>
            <Form.Input 
              placeholder="palceholder"
              value={ this.state.username }
              onChange={ this.handleChangeUsername }
            />
          </Form.Control>
        </Form.Field> 

        <Form.Field>
          <Form.Label>
            password
          </Form.Label>
          <Form.Control>
            <Form.Input 
              placeholder="password"
              value={ this.state.password }
              onChange={ this.handleChangePassword }
            />
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Control>
            <Button
              onClick={ this.handleSubmit }
              value="submit"
            >
              Valider
            </Button>
          </Form.Control>
        </Form.Field>
      </div>
    )
  }
}

export default LoginForm
