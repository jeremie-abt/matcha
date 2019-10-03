import React from 'react'
import { Section } from 'react-bulma-components'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import OurHeader from '../components/OurHeader'
import OurFooter from '../components/OurFooter'

function PageSkeleton({ location, children }) {
  const myClasses = classNames({
    homepage: true,
    'image-background': location.pathname === '/',
    'register-background': location.pathname === '/register'
  })

  return (
    <div className='layout-color'>
      <OurHeader />
      <Section className={myClasses}>{children}</Section>
      <OurFooter />
    </div>
  )
}

export default withRouter(PageSkeleton)
