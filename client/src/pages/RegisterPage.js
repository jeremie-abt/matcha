import React from 'react'
import { Container, Card, Columns, Content } from 'react-bulma-components'
import FormCreateProfil from '../components/Form/formComponent/FormCreateProfil'
import PageSkeleton from '../components/layout/PageSkeleton'

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
                <FormCreateProfil/>
              </Card.Content>
            </Card>
          </Columns.Column>
        </Columns>
      </Container>
    </PageSkeleton>
  )
}

export default LoginPage
