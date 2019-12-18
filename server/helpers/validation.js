function valideForm(formData) {
  const {
    firstname,
    lastname,
    email,
    password,
    confirmpassword,
    username,
    gender
  } = formData

  const verifyNamePattern = RegExp('^(?=.*[a-zA-Z]{3,})')
  if (firstname) {
    if (!verifyNamePattern.exec(firstname)) return false
  }
  if (lastname) {
    if (!verifyNamePattern.exec(lastname)) return false
  }
  if (username) {
    if (!verifyNamePattern.exec(username)) return false
  }
  const verifyMailPattern = RegExp('^.{1,25}@.{2,15}\\.[^.]{2,4}$')
  if (email) {
    if (!verifyMailPattern.exec(email)) return false
  }
  const verifyPasswordPattern = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  if (password && confirmpassword) {
    if (!verifyPasswordPattern.exec(password)) {
      return false
    }
    if (confirmpassword !== password) return false
  }
  if (gender) {
    if (gender !== 'bisexual' && gender !== 'male' && gender !== 'female')
      return false
  }
  return true
}

module.exports = valideForm
