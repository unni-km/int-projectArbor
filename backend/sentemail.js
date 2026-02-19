
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "frontdesk.integris@gmail.com",       
    pass: "qptvgagdmxuupegg",            
  },
});

const sendEmail = async (to, subject, text, html = null) => {
    const mailOptions = {
      from: "frontdesk.integris@gmail.com",
      to,
      subject,
      text,
      ...(html && { html }),
    };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

export default sendEmail
