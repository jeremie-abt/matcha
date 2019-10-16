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
    axios
      .post('/upload', file)
      .then(res => {
        console.log(res)
        const { data } = res
        axios
          .post('images/add', { userId, position: 2, url: data.path })
          .then(res => {
            console.log(res)
          })
          .catch(e => console.log(e))
      })
      .catch(err => console.log(err))
  }

  const UploadForm = () => {
    return (
      <div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <input type='file' onChange={handleChange} />
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
