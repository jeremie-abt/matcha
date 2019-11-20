import React from 'react'
import { Tag, Icon } from 'react-bulma-components'

const ImageComponent = ({ images, deleteImage, handleProfilImage }) => {
  const displayedFakeImages = 5 - images.length

  const FakeImage = () => {
    return (
      <div className='placeholder col'>
        <Icon>
          <span className='fas fa-plus' />
        </Icon>
      </div>
    )
  }

  const MyImage = ({ url, id, profil }) => {
    return (
      <div>
        <Tag remove onClick={deleteImage} id={id} url={url} />
        <img
          id={id}
          src={url}
          alt=''
          className='img my-image'
          onClick={handleProfilImage}
        />
        <div>{profil ? 'Profil' : null}</div>
      </div>
    )
  }

  return (
    <div className='images-container'>
      {images
        .sort((a, b) => a.position - b.position)
        .map((img, index) => {
          return (
            <div className='col' key={index}>
              <MyImage url={img.url} id={img.id} profil={img.is_profil} />
            </div>
          )
        })}
      {Array(displayedFakeImages)
        .fill(0)
        .map((map, index) => {
          return <FakeImage key={index} />
        })}
    </div>
  )
}

export default ImageComponent
