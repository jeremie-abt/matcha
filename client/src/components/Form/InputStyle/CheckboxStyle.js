
import React from 'react'
import { Panel } from 'react-bulma-components'

function CheckboxStyle( {onchange, label, ...props} ) {

  return (
    <Panel>
      {label}     
      <input type="checkbox" onChange={onchange} {...props} />
    </Panel>
  )
}

export default CheckboxStyle
