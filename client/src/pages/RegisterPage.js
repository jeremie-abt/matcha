import React, { useState } from 'react'
import { Container, Card, Columns, Content } from 'react-bulma-components'
import FormCreateProfil from '../components/Form/formComponent/FormCreateProfil'
import PageSkeleton from '../components/layout/PageSkeleton'
import { Redirect } from 'react-router-dom'

function LoginPage() {
  const [accountCreated, setAccountCreated] = useState(false)

  return (
    <div>
      {
        accountCreated &&
        <Redirect to={{
          pathname: '/',
          state: {
            msg: {
              success: "Profil ok"
            }
          }
        }}/>
      }
      <PageSkeleton>
        <Container>
          <Columns>
            <Columns.Column className='register'>
              <Card>
                <Content>
                  <h1 className='register-title'>Join Matcha</h1>
                </Content>
                <Card.Content className='register-format'>
                  <FormCreateProfil setAccountCreated={setAccountCreated}/>
                </Card.Content>
              </Card>
            </Columns.Column>
          </Columns>
        </Container>
      </PageSkeleton>

    </div>
  )
}

export default LoginPage
