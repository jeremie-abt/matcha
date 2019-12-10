const nodemailer = require('nodemailer')
const mailIdentifier = require('../config/mailIdentifiant')

/**
 *
 * @param {string} token
 * @param {string} mail
 * @param {string} path path in the mail URL ( correspond to the endpoint
 *                      which will handle the actual request )
 */

function sendMail(token, mail, path, id) {
  // je veux lui envoyer un lien :
  // https://localhost:8081/api/auth/confirm

  const link = `${path}${id}/${token}`
  const BodyMsg =
    'Your about to find the love of your ' +
    'life, Clink on the following ' +
    `<a href='${link}'>link</a>` +
    ` to register your account`
  const transporter = nodemailer.createTransport({
    sendmail: true,
    //host: 'smtp.ethereal.email',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'matcha42jabtdalauren@gmail.com',
      pass: 'Mystas95'
    },
  })

  // alors pour l'instant j'envoie directement les mails
  // dans ma boite mail, pour changer il faut remplacer le
  // abtjeremie@gmail.com mit en dur par la variable mail
  // -> enfaite ca va dans les spams et je pense que c'est
  // du au fait d'utiliser ethereal comme serveur smtp
  // bref je verrai ca plus tard
  transporter.sendMail({
    from: 'no-reply@matcha.com', // sender address
    to: 'abtjeremie@gmail.com', // list of receivers
    subject: 'Inscription matcha', // Subject line
    html: BodyMsg
  })
}

module.exports = {
  sendMail
}
