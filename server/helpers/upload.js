const add = (req, res) => {
  if (!req.file) res.send({ success: false })
  else {
    res.send({
      success: true,
      path: `http://${req.hostname}:8081/${req.file.filename}`
    })
  }
}

module.exports = {
  add
}
