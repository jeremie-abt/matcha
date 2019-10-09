import React, { useState, useEffect } from 'react'
import { Card, Columns, Loader } from 'react-bulma-components'
import ImageComponent from './Images'
import axios from 'axios'

const UserImages = ({ userId }) => {
  const [userImages, setUserImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(userId)
    if (userId) {
      axios
        .get(`/${userId}/images`)
        .then(({ data }) => {
          console.log(data)
          if (Object.keys(data).length) {
            setUserImages([...data])
          }
          setIsLoading(false)
        })
        .catch(err => {
          throw err
        })
    }
  }, [userId])

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Columns centered>
          <Columns.Column className='has-text-centered'>
            {/* if 0 image props = 0 else arr image */}
            {isLoading ? <Loader /> : <ImageComponent images={userImages} />}
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  )
}

export default UserImages
