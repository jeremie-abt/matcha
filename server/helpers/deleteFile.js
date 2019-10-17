const fs = require('fs')

const deleteImage = url => {
  const splitUrl = url.split('/')
  const path = `img/${splitUrl[splitUrl.length - 1]}`
  fs.unlink(path, err => {
    if (err) throw err
    console.log('file was deleted')
  })
}
module.exports = {
  deleteImage
}
