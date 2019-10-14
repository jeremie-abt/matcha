const msg = ({ firstname, lastname }, type) => {
  let content
  switch (type) {
    case 'view':
      content = `${firstname} ${lastname} visited your profil`
      break
    case 'like':
      content = `${firstname} ${lastname} liked your profil`
      break
    case 'match':
      content = `${firstname} ${lastname} and you are a MATCH!`
      break
    default:
      content = "don't know what the fuck i'm doing"
      break
  }
  return content
}

module.exports.msg = msg
