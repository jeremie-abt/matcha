import React from 'react'
import { Section } from 'react-bulma-components'
import { withRouter } from 'react-router-dom'
import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function PageSkeleton({ location, children }) {
  return (
    <div className='layout-color'>
      <OurHeader />
      <Section
        className={
          'homepage ' + (location.pathname === '/' ? 'image-background' : '')
        }
      >
        {children}
      </Section>
      <OurFooter />
    </div>
  )
}

export default withRouter(PageSkeleton)
