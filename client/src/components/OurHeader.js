import React from 'react'
import { Section } from 'react-bulma-components'

import OurNavbar from './OurNavbar'

function OurHeader() {
  return (
    <Section className='small-height'>
      <div className=''>
        <OurNavbar />
      </div>
    </Section>
  )
}

export default OurHeader
