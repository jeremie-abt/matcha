import React from 'react'
import { Menu } from 'react-bulma-components'

function SideBar({ curComponent, setCurComponent }) {
  const isActive = el => {
    if (curComponent === el) return 'is-active'
  }

  return (
    <Menu className='sidebar'>
      <Menu.List title='User options'>
        <Menu.List.Item
          className={isActive('search')}
          onClick={() => setCurComponent('search')}
        >
          search
        </Menu.List.Item>
        <Menu.List.Item
          className={isActive('profil')}
          onClick={() => setCurComponent('profil')}
        >
          Profil
        </Menu.List.Item>
        <Menu.List.Item
          className={isActive('update')}
          onClick={() => setCurComponent('update')}
        >
          Account
        </Menu.List.Item>
        <Menu.List.Item
          className={isActive('images')}
          onClick={() => setCurComponent('images')}
        >
          Images
        </Menu.List.Item>
      </Menu.List>

      <Menu.List title='Relations'>
        <Menu.List.Item
          className={isActive('seen')}
          onClick={() => setCurComponent('seen')}
        >
          Seen
        </Menu.List.Item>
        <Menu.List.Item
          className={isActive('like')}
          onClick={() => setCurComponent('like')}
        >
          Like
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
