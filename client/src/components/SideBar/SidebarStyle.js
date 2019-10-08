import React from 'react'

import { Menu } from 'react-bulma-components'


/**
 * 
 * SideBarStyle is a style wrapper component
 * Which wraps the array of buttons
 * 
 */
function SidebarStyle() {
  
  return (
    <Menu>
      <Menu.List title="matcha">
        <Menu.List.Item>Infos</Menu.List.Item>
        <Menu.List.Item>Match</Menu.List.Item>
      </Menu.List>
    </Menu>
  )
}

export default SidebarStyle
