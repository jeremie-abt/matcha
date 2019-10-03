import React from 'react'
import { Content, Container, Hero } from 'react-bulma-components'

function OurFooter() {
  return (
    <Hero.Footer className="small-height backgroundColor">
      <Container>
        <Content>
          <p>
        Matcha site de rencontre, the code is open source, you can contact
        jabt or dalauren to get the code, penser a mettre un vraie text
          </p>
        </Content>
      </Container>
    </Hero.Footer>
  )
}

export default OurFooter
