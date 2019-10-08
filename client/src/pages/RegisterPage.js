import React from 'react'
import { Container, Card, Columns, Content } from 'react-bulma-components'
import FormCreateProfil from '../components/Form/formComponent/FormCreateProfil'
import PageSkeleton from '../components/layout/PageSkeleton'
import MyContext from '../context/UserContext'

function LoginPage() {
  return (
    <PageSkeleton>
      <Container>
        <Columns>
          <Columns.Column className='register'>
            <Card>
              <Content>
                <h1 className='register-title'>Join Matcha</h1>
              </Content>
              <Card.Content className='register-format'>
                <MyContext.Consumer>
                  {
                    context => {
                      return <FormCreateProfil
                        setUserLogged={context.setUserLogged} />
                    }
                  }
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
