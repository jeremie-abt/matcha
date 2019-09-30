import React from 'react'
import { Hero } from 'react-bulma-components'

import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function PageSkeleton({ children }) {
  
  return (
    <Hero size="fullheight">
      <OurHeader />
          { children }
      <OurFooter />
    </Hero>
  )
}

export default PageSkeleton
