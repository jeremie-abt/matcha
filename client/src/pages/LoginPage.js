import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import { Container, Card, Columns, Hero } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'
import MyContext from '../context/UserContext'

let fields = [
  {
    name: 'username',
    label: 'Username',
    type: 'text'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password'
  }
]

function LoginPage() {
  return (
    <div>
      <Hero className='is-fullheight'>
        <Hero.Body>
          <Container>
            <Columns className='is-centered'>
              <Columns.Column size='two-fifths'>
                <Card>
                  <Card.Content>
                    <MyContext.Consumer>
                      {context => (
                        <LoginForm
                          fields={fields}
                          updateUser={context.updateState}
                          updateIsAuth={context.updateIsAuth}
                        />
                      )}
                    </MyContext.Consumer>
                  </Card.Content>
                </Card>
              </Columns.Column>
            </Columns>
          </Container>
        </Hero.Body>
      </Hero>
    </div>
  )
}

export default LoginPage
