import React from 'react'

import { Menu } from 'react-bulma-components'

function SideBar() {

  return (
    <Menu className="sidebar">
      <Menu.List>
        <Menu.List.Item>Modifier les infos (+ localisation)</Menu.List.Item>
        <hr />
        <Menu.List.Item>Modifier Image (david)</Menu.List.Item>
        <hr />
        <Menu.List.Item>Voir les likes / match / views !</Menu.List.Item>
        <hr />
        <Menu.List.Item>Calcul des points de popularite</Menu.List.Item>
      </Menu.List>
    </Menu>
  )
}

export default SideBar
