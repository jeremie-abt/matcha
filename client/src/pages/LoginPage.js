import React from 'react'
import { Container, Card, Content } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'
import MyContext from '../context/UserContext'
import PageSkeleton from '../components/PageSkeleton'

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
    <PageSkeleton>
      <Container className='login-form'>
        <Card>
          <Card.Content>
            <Content>
              <h1> Sign-in</h1>
            </Content>
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
      </Container>
    </PageSkeleton>
  )
}

export default LoginPage
