import React from 'react'
import {
  Hero, Container,
  Section, Content } from 'react-bulma-components'

import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function homePage() {
  return (
  <Hero size="fullheight">
    <Section className="small-height backgroundColor">
      <Container>
        <OurHeader />
      </Container>
    </Section>
        
    <Container>
      <Hero.Body>
        <Content>
          <h1>Bonjour je suis le body</h1>
        </Content>
      </Hero.Body>
    </Container>  

    <Hero.Footer className="small-height backgroundColor">
      <Container>
        <OurFooter />
      </Container>
    </Hero.Footer>
  </Hero>
  )
}

export default homePage
