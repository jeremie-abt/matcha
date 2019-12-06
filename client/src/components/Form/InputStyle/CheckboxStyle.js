import React from 'react'
import { Tag } from 'react-bulma-components'

function CheckboxStyle({ handleChange, label, ...props }) {
  return (
    <Tag
      className={'search-tags' + (props.checked ? ' is-checked' : '')}
      onClick={handleChange}
      {...props}
    >
      #{label}
    </Tag>
  )
}

export default CheckboxStyle
