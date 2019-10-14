import React, { useState, useEffect } from 'react'
import { Card, Columns, Loader, Button } from 'react-bulma-components'
import ImageComponent from './Images'
import axios from 'axios'

const UserImages = ({ userId }) => {
  const [userImages, setUserImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState('')

  useEffect(() => {
    if (userId) {
      axios
        .get(`/${userId}/images`)
        .then(({ data }) => {
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

  const handleSubmit = e => {
    e.preventDefault()
    console.log(file)
    axios.post('/images/add', { file })
  }

  const handleChange = e => {
    console.log(e.target.value)
    setFile(e.target.value)
  }

  const UploadForm = () => {
    return (
      <div>
        <form action='post' encType='multipart/form-data'>
          <input type='file' name='myImage' onChange={handleChange} />
          <input type='submit' value='Upload Photo' />
        </form>
      </div>
    )
  }

  const deleteImage = e => {
    const pos = e.target.getAttribute('position')
    console.log(pos)
  }

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Columns centered>
          <Columns.Column className='has-text-centered'>
            {/* if 0 image props = 0 else arr image */}
            {isLoading ? (
              <Loader />
            ) : (
              <ImageComponent images={userImages} deleteImage={deleteImage} />
            )}
          </Columns.Column>
        </Columns>
        <div className='has-text-centered'>
          {userImages.length === 5 ? (
            <Button disabled>Too Many pictures</Button>
          ) : (
            <UploadForm />
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

export default UserImages
