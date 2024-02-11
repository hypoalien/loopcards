require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmail(email, type, code) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";

    const port = 465;

    const senderAddress = "fractalcards@gmail.com";

    var toAddress = email;

    const smtpUsername = "apikey";

    const smtpPassword = process.env.SG_APIKEY;

    if (type == "WELCOME") {
      var subject = "Welcome to Fractal Cards";

      var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Thanks for using Fractal Cards : </p> <b></b>
      </body>
    </html>`;
    } else {
      var subject = "Reset your Password";

      // The body of the email for recipients
      var body_html = `<!DOCTYPE>
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;
    }

    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    let info = await transporter.sendMail(mailOptions);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

module.exports = { sendEmail };
