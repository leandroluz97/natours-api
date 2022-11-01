const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1)  Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'ef89dc73cc6d74',
      pass: 'b200b3040f8ace',
    },
  });
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     secure: false,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  let info = await transporter.sendMail({
    from: 'foo@example.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });
};

module.exports = sendEmail;
