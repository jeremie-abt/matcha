import React from 'react'
import { Section, Container } from 'react-bulma-components'

import OurNavbar from './OurNavbar'

function OurHeader() {
  
  return (
    <Section className="small-height backgroundColor">
      <Container>
        <OurNavbar />
      </Container>
    </Section>
  )
}

export default OurHeader
