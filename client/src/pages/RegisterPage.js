import React from 'react'
import { Container, Card, Columns, Hero } from 'react-bulma-components'

import FormCreateProfil from '../components/Form/formComponent/FormCreateProfil'
import PageSkeleton from '../components/genericPagesComponent/PageSkeleton'

/*let fields = [
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
*/
function LoginPage() {
  return (
    <PageSkeleton>
      <Hero.Body>
        <Container>
          <Columns className='is-centered'>
            <Columns.Column>
              <Card>
                <Card.Content>
                  <FormCreateProfil />
                </Card.Content>
              </Card>
            </Columns.Column>
          </Columns>
        </Container>
      </Hero.Body>
    </PageSkeleton>
  )
}

export default LoginPage
