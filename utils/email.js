const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Leandro Luz <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV.trim() === 'production') {
      // Sendgrid
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      secure: false,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    // 2) Define email options
    const mailOptions = {
      from: this.from, // sender address
      to: this.to, // list of receivers
      subject: subject, // Subject line
      html: html,
      text: htmlToText.convert(html),
    };
    // 3) Create a transport an send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours APP!');
  }
};

const sendEmail = async (options) => {
  // 1)  Create a transporter
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.mailtrap.io',
  //     port: 2525,
  //     auth: {
  //       user: 'ef89dc73cc6d74',
  //       pass: 'b200b3040f8ace',
  //     },
  //   });

  let info = await transporter.sendMail({
    from: 'foo@example.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });
};

// module.exports = sendEmail;
