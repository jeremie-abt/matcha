const add = (req, res) => {
  if (!req.file) {
    console.log('No file received')
    res.send({ success: false })
  } else {
    console.log('file received')
    res.send({
      success: true,
      path: `http://${req.hostname}:8081/${req.file.filename}`
    })
  }
}

module.exports = {
  add
}
