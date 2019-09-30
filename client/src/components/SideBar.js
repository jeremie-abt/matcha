import React from 'react'

import { Menu, Button } from 'react-bulma-components'

function SideBar({ handleClick }) {

  return (
    <Menu className="sidebar">
      <Menu.List>
        <Menu.List.Item>
          <Button onClick={() => handleClick("profil")}>
            Profil
          </Button>
        </Menu.List.Item>
        <hr />
        <Menu.List.Item>
          <Button onClick={() => handleClick("update")}>
            Modifier les infos (+ localisation)
          </Button>
        </Menu.List.Item>
        <hr />
        <Menu.List.Item>
          <Button onClick={() => handleClick("like")}>
            Voir les likes !
          </Button>
        </Menu.List.Item>
        <hr />
        <Menu.List.Item>
          <Button onClick={() => alert("not implemented")}>
            Voir les Match
          </Button>
        </Menu.List.Item>
        <hr />
        <Menu.List.Item>
          <Button onClick={() => alert("not implemented")}>
            Calcul des points de popularite
          </Button>
        </Menu.List.Item>
      </Menu.List>
    </Menu>
  )
}

export default SideBar
