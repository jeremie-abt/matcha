import React from 'react'
import { Menu } from 'react-bulma-components'

function SideBar({ curComponent, setCurComponent }) {
  const components = ['profil', 'update', 'like']

  const isActive = el => {
    if (curComponent === el) return 'is-active'
  }

  return (
    <Menu className='sidebar'>
      <Menu.List title='User options'>
        <Menu.List.Item
          className={isActive(components[0])}
          onClick={() => setCurComponent(components[0])}
        >
          Profil
        </Menu.List.Item>
        <Menu.List.Item
          className={isActive(components[1])}
          onClick={() => setCurComponent(components[1])}
        >
          Account
        </Menu.List.Item>
        <Menu.List.Item>Images</Menu.List.Item>
      </Menu.List>

      <Menu.List title='Relations'>
        <Menu.List.Item
          className={isActive(components[2])}
          onClick={() => setCurComponent(components[2])}
        >
          Likes
        </Menu.List.Item>
        <Menu.List.Item onClick={() => alert('not implemented')}>
          Matchs
        </Menu.List.Item>
      </Menu.List>

      <Menu.List title='Popularity'>
        <Menu.List.Item onClick={() => alert('not implemented')}>
          Popularite
        </Menu.List.Item>
      </Menu.List>
    </Menu>
  )
}

export default SideBar
