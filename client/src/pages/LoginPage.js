import React from 'react'
import { Container, Card, Content } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'
import MyContext from '../context/UserContext'
import PageSkeleton from '../components/layout/PageSkeleton'

let fields = [
  {
    name: 'username',
    label: 'pseudo',
    type: 'text'
  },
  {
    name: 'password',
    label: 'mot de passe',
    type: 'password'
  }
]

function LoginPage() {
  return (
    <PageSkeleton>
      <Container className='login-form'>
        <Card>
          <Card.Content>
            <Content>
              <h1> Sign-in</h1>
            </Content>
            <MyContext.Consumer>
              {context => {
                return (
                  <LoginForm
                    fields={fields}
                    setUserLogged={context.setUserLogged}
                  />
                )
              }}
            </MyContext.Consumer>
          </Card.Content>
        </Card>
      </Container>
    </PageSkeleton>
  )
}

export default LoginPage
