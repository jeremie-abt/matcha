import React from 'react'
import AwesomeSlider from 'react-awesome-slider'
import 'react-awesome-slider/dist/styles.css'

const Slide = ({ images }) => {
  return (
    <AwesomeSlider bullets={false}>
      {images.map(image => {
        return <div key={image.id} data-src={image.url} />
      })}
    </AwesomeSlider>
  )
}

export default Slide
