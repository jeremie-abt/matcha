import React from 'react'
import { Hero, Container } from 'react-bulma-components'

import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function PageSkeleton({ children }) {
  
  return (
    <Hero size="fullheight">
      <OurHeader />
      <Container>
        <Hero.Body>
          { children }
        </Hero.Body>
      </Container>
      <OurFooter />
    </Hero>
  )
}

export default PageSkeleton
