const msg = type => {
  let content
  switch (type) {
    case 'view':
      content = `Someone visited your profil`
      break
    case 'like':
      content = `someone liked your profil`
      break
    case 'match':
      content = `You get a new Match`
      break
    default:
      content = "don't know what the fuck i'm doing"
      break
  }
  return content
}

module.exports.msg = msg
