import React from 'react'
import { Section, Container } from 'react-bulma-components'
import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function PageSkeleton({ children }) {
  return (
    <div className='layout-color'>
      <OurHeader />
      <Section className='homepage'>
        <Container>{children}</Container>
      </Section>
      <OurFooter />
    </div>
  )
}

export default PageSkeleton
