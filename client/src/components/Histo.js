import React,
  { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import userContext from '../context/UserContext'
import { Card, Media, Heading, Content } 
  from 'react-bulma-components'


function Histo({type}) {

  const context = useContext(userContext)
  const [data, setData] = useState([])
  const id = context.store.user.id

  useEffect(() => {
    axios
      .get('/' + type + '/' + id)
      .then(resp => {
        setData(resp.data)
      })
      .catch((e) => 
        console.log("ceci est un beug : ", e)
      )
  }, [type, id])

  if (data.length === 0) {
    
    return (
      <Content>
        Desole aucun {type} t'es juste trop moche arrete de perdre ton temps
        sur notre appli
      </Content>
    )
  } else {
    return (
      data.map(elem => {
        return (
          <Card key={elem.username}>
            <Card.Content>
              <Media>
                <Media.Item>
                  Put jolie image here
                </Media.Item>
                <Media.Item>
                  <Heading size={4}>{elem.firstname}</Heading>
                  <Heading size={6}>{elem.lastname}</Heading>
                </Media.Item>
              </Media>
              <Content>
                {elem.bio}
              </Content>
            </Card.Content>
          </Card>
        )
      })
    )
  } 
}

export default Histo
