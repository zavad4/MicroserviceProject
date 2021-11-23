const srvc = require('../services.config.js');
const wdo = require('../wdo.js');
const nodemailer = require("nodemailer");

async function mail(emailTo) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "maxmaildritte@gmail.com",
        pass: "aq36fg36", 
      },
    });
    let info = await transporter.sendMail({
      from: '"Team"', 
      to: emailTo,
      subject: "Notification",
      text: "Hello from api_service!",
    });
    return info;
  }

const notificate = async (args) => {
  try {
      const {email} = args.argsArr;
      const info = await mail(email);
      return { data: info, err: null };
  } catch (err) {
      return { data: null, err};
  }
};

module.exports.default = notificate;
//http://localhost:8080/api/some-api-service/notification?email=lizavodovska@gmail.com
//http://localhost:8080/api/some-api-service/notification?email=olholota@gmail.com