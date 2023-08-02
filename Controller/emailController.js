const nodemailer = require('nodemailer');
// require "dotenv.config()"

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email', 
    // port: 587,
    service:"gmail",
    auth: {
      user: 'dummydummysharma@gmail.com',
      pass: 'hjwvsvpxnpwswflp',
    },
  });
  


  const sendEmailAlert = async (recipientEmail, subject, body) => {
    try {
      const mailOptions = {
        from: 'dummydummysharma@gmail.com', 
        to: recipientEmail,
        subject: subject,
        html: body,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  module.exports = sendEmailAlert