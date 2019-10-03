import React from 'react'
import { Container, Card, Columns } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'
import MyContext from '../context/UserContext'
import PageSkeleton from '../components/genericPagesComponent/PageSkeleton'

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
      <Container>
        <Columns className='is-centered'>
          <Columns.Column>
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
    </PageSkeleton>
  )
}

export default LoginPage
