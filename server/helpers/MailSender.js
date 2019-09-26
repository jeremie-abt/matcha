const nodemailer = require('nodemailer')

const mailIdentifier = require("../config/mailIdentifiant")
const domainName = require('../config/domainName')

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
    `${domainName  }api/auth${path}${
     token}`
  const BodyMsg = 'Your about to find the love of your '
      + 'life, Clink on the following link if you want : ' 
      + `<a href='${link}'>Bite</a>`
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
