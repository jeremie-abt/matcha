function parseFormData(formData) {
  const {
    email,
    password,
    confirmpassword,
    currentDate,
    firstname,
    lastname,
    username
  } = formData

  if (currentDate) {
    let tmpDate = new Date()
    if (tmpDate - currentDate < 0) return 'Invalide Date'
    tmpDate = new Date(
      tmpDate.getFullYear() - 18,
      tmpDate.getMonth(),
      tmpDate.getDate()
    )
    if (currentDate >= tmpDate) return 'Invalide Date'
  }

  const verifyNamePattern = RegExp('^(?=.*[a-zA-Z]{3,})')
  if (firstname) {
    if (!verifyNamePattern.exec(firstname)) return 'prenom invalide ...'
  }
  if (lastname) {
    if (!verifyNamePattern.exec(lastname)) return 'nom invalide ...'
  }
  if (username) {
    if (!verifyNamePattern.exec(username)) return 'pseudo invalide ...'
  }

  const verifyMailPattern = RegExp('^.{1,25}@.{2,15}\\.[^.]{2,4}$')
  if (email) {
    if (!verifyMailPattern.exec(email))
      return 'veuillez mettre une addresse mail valide ...'
  }
  // regex password :
  // - at least one minuscule / majuscule / number / special character
  // - at least 8 character
  //console.log("fiestname : ", user)
  const verifyPasswordPattern = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  if (password && confirmpassword) {
    if (!verifyPasswordPattern.exec(password)) {
      return (
        'le mot de passe est trop faible, il doit faire 8 caractere de long ' +
        'et contenir au moins une lettre majuscule, minuscule, un chiffre ' +
        'et un caractere special !'
      )
    }
    if (confirmpassword !== password)
      return 'Password and confirmpassword ne sont pas identiques ...'
  }
  return true
}

export default parseFormData
