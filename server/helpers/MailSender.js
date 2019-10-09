const nodemailer = require('nodemailer')

const mailIdentifier = require("../config/mailIdentifiant")

/**
 * 
 * @param {string} token 
 * @param {string} mail 
 * @param {string} path path in the mail URL ( correspond to the endpoint
 *                      which will handle the actual request )
 */

function sendMail(token, mail, path) {
  // je veux lui envoyer un lien :
  // https://localhost:8081/api/auth/confirm
 
  const link = 
    `${path}${token}`
  const BodyMsg = 'Your about to find the love of your '
      + 'life, Clink on the following '
      + `<a href='${link}'>link</a>`
      + ` to register your account`
  const transporter = nodemailer.createTransport({
    sendmail: true,
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: mailIdentifier.username,
        pass: mailIdentifier.password
    }
  })

  console.log("mail : ", mail )
  transporter.sendMail({
    from: 'no-reply@matcha.om', // sender address
    to: mail, // list of receivers
    subject: 'Inscription matcha', // Subject line
    html: BodyMsg
  })
}


module.exports= {
  sendMail
}
