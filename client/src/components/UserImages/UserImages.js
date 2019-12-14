/* eslint-disable eqeqeq */
import React, { useState, useEffect, useContext } from 'react'
import { Card, Columns, Button } from 'react-bulma-components'
import ImageComponent from './Images'
import axios from 'axios'

import userContext from '../../context/UserContext'

const UserImages = ({ userId }) => {
  const [userImages, setUserImages] = useState([])
  const [file, setFile] = useState('')
  const context = useContext(userContext)

  useEffect(() => {
    if (userId) {
      getImages(userId)
    }
  }, [userId])

  const getImages = userId => {
    axios
      .get(`/${userId}/images`)
      .then(({ data }) => {
        if (Object.keys(data).length) setUserImages([...data])
      })
      .catch(err => {
        throw err
      })
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!file) return
    axios
      .post('/upload', file)
      .then(res => {
        const { data } = res
        axios
          .post('images/add', { userId, url: data.path })
          .then(res => {
            context.updateProfilCompleted()
            getImages(userId)
          })
          .catch(err => console.log(err))
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
    const url = e.target.getAttribute('url')

    axios
      .delete('/images/delete', { data: { imageId, userId, url } })
      .then(res => {
        const images = userImages.filter(img => img.id != imageId)
        setUserImages(images)
        context.updateProfilCompleted()
        // notif -> image destroyed
      })
      .catch(err => console.log(err))
  }

  const handleProfilImage = e => {
    const id = parseInt(e.target.getAttribute('id'), 10)
    axios
      .put('/images/update', { imageId: id, userId })
      .then(res => {
        getImages(userId)
      })
      .catch(err => console.log(err))
  }

  const UploadForm = () => {
    return (
      <div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <input type='file' accept='image/*' onChange={handleChange} />
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
            <ImageComponent
              images={userImages}
              deleteImage={deleteImage}
              handleProfilImage={handleProfilImage}
            />
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
