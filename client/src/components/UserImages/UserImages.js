/* eslint-disable eqeqeq */
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
    axios
      .post('/upload', file)
      .then(res => {
        const { data } = res
        axios
          .post('images/add', { userId, position: 2, url: data.path })
          .then(res => {
            const newImage = JSON.parse(res.config.data)
            setUserImages([...userImages, newImage])
          })
          .catch(e => console.log(e))
      })
      .catch(err => console.log(err))
  }

  const handleChange = e => {
    const data = new FormData()
    data.append('file', e.target.files[0])
    setFile(data)
  }

  const deleteImage = e => {
    const imageId = e.target.getAttribute('id')
    axios
      .delete('/images/delete', { data: { imageId, userId } })
      .then(res => {
        const images = userImages.filter(img => img.id != imageId)
        setUserImages(images)
        console.log(res)
        // notif -> image destroyed
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

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Columns centered>
          <Columns.Column className='has-text-centered'>
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
