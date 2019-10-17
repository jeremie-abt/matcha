import React from 'react'
import { Columns, Image, Tag } from 'react-bulma-components'

const ImageComponent = ({ images, deleteImage }) => {
  const NoImage = () => {
    return <div>No Image</div>
  }

  const MyImage = ({ url, id }) => {
    return (
      <div className='image'>
        <Tag remove onClick={deleteImage} id={id} url={url} />
        <Image src={url} alt='' className='my-images' />
      </div>
    )
  }

  return (
    <Columns centered className='images-container'>
      {images.length ? (
        images
          .sort((a, b) => a.position - b.position)
          .map((img, index) => {
            return (
              <Columns.Column key={index}>
                <MyImage url={img.url} id={img.id} />
              </Columns.Column>
            )
          })
      ) : (
        <NoImage />
      )}
    </Columns>
  )
}

export default ImageComponent
