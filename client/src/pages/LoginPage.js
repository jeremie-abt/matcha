import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import { Container, Card, Columns, Hero } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'

let fields = [
  {
    name: 'Username',
    label: 'Username',
    type: 'text'
  },
  {
    name: 'Password',
    label: 'Password',
    type: 'text'
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
                    <LoginForm fields={fields} />
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
