const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou config SMTP { host, port, secure, auth }
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendPasswordResetCode = async (to, code) => {
  return transporter.sendMail({
    from: `"Medical e-Note" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Réinitialisation de mot de passe',
    text: `Votre code de réinitialisation est : ${code}. Il expire dans 15 minutes.`
  });
};
