import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Card, Content } from 'react-bulma-components'
import LoginForm from '../components/Form/formComponent/FormLogin'
import MyContext from '../context/UserContext'
import PageSkeleton from '../components/layout/PageSkeleton'
import { useToasts } from 'react-toast-notifications'


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

const LoginPage = withRouter(({ location }) => {
  const { addToast } = useToasts()
  
  // j'ai fais un useEffect pour pouvoir surveiller la variable
  // location.state, enfaite sinon je ne peux pas le rendre empty
  // je ne pense pas que ce soit possible d'ailleurs !
  useEffect(() => {
    if (location.state.msg.success) {
      addToast(location.state.msg.success, {
        appearance: 'success',
        autoDismiss: true
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

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
})

export default LoginPage
