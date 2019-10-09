import React from 'react'
import { Card, Columns, Image } from 'react-bulma-components'

const ImageComponent = ({ images }) => {
  console.log(images)
  const NoImage = () => {
    return <div>No Image</div>
  }

  const MyImage = ({ url }) => {
    return (
      <div style={{ width: '70px', height: '70px' }}>
        <Image src={url} alt='' className='my-image' />
      </div>
    )
  }

  return (
    <Card className='card-fullwidth'>
      <Card.Content>
        <Columns centered>
          <Columns.Column className='has-text-centered images-container'>
            {images.length ? (
              images.map(img => {
                return <MyImage url={img.url} key={img.position} />
              })
            ) : (
              <NoImage />
            )}
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  )
}

export default ImageComponent
