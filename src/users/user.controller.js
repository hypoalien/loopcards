const Joi = require("joi");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

// const { generateJwt } = require("./utils/generateJwt.js");
// const { sendEmail } = require("./utils/mailer.js");
const User = require("./user.model");
// const createVCF = require("./utils/utility.js");

//Validate user schema
const userSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  cardID: Joi.string(),
});
function createVCF(details) {
  var {
    firstname,
    lastname,
    phone,
    email,
    company,
    website,
    socialLinks,
    title,
    about,
  } = details;
  company = company ? company : "Example.org";
  website = website ? website : "https://example.com";
  title = title ? title : "A good Friend";
  about = about ? about : "about A good Friend";

  let vcf = "BEGIN:VCARD";
  vcf +=
    `VERSION:3.0` +
    "\n" +
    `N:${firstname};${lastname};;;` +
    "\n" +
    `FN:${firstname} ${lastname}` +
    "\n" +
    `ORG:${company};` +
    "\n" +
    `TITLE:${title}` +
    "\n" +
    `EMAIL;type=INTERNET;type=WORK;type=pref:${email}` +
    "\n" +
    `TEL;type=WORK;type=pref:${phone}` +
    "\n" +
    `NOTE:${about}.` +
    "\n" +
    `item1.URL;type=pref:${website}` +
    "\n" +
    `item1.X-ABLabel:_$!<HomePage>!$_\n`;
  socialLinks.forEach(({ platform, url }) => {
    vcf += `X-SOCIALPROFILE;TYPE=${platform}:${url}\n`;
  });

  vcf += "END:VCARD";
  console.log(vcf);

  return vcf;
}
async function generateJwt(email, userId) {
  try {
    const payload = { email: email, id: userId };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    return { error: false, token: token };
  } catch (error) {
    return { error: true };
  }
}
const options = {
  expiresIn: "1h",
};

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

exports.Signup = async (req, res) => {
  try {
    const result = userSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    //Check if the email has been already registered.
    var user = await User.findOne({
      email: result.value.email,
    });

    if (user) {
      return res.json({
        error: true,
        message: "Email is already in use",
      });
    }

    const hash = await User.hashPassword(result.value.password);

    const id = uuid(); //Generate unique id for the user.

    result.value.userId = id;

    delete result.value.confirmPassword;
    result.value.password = hash;

    const sendCode = await sendEmail(result.value.email, "WELCOME");

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send Welcome email.",
      });
    }
    var cardMessage = "Card not linked";
    if (result.value.cardID) {
      result.value.active = true;
      cardMessage = "card linked successfully";
    }
    const { error, token } = await generateJwt(
      result.value.email,
      result.value.userId,
    );
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    result.value.accessToken = token;

    const newUser = new User(result.value);
    await newUser.save();

    return res.status(200).json({
      success: true,
      message: `Registration Success and ${cardMessage}`,
      accessToken: token,
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.status(500).json({
      error: true,
      message: "Cannot Register",
      // activation_code: code,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password, cardID } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    //3. Verify the password is valid
    const isValid = await User.comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    //Generate Access token

    const { error, token } = await generateJwt(user.email, user.userId);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    user.accessToken = token;
    var message = "";

    if (cardID && user.active == false) {
      user.cardID = cardID;
      user.active = true;
      message = "card linked successfuly";
    }
    if (user.active == true) {
      message = "card already linked ";
    } else {
      message = "card not linked ";
    }

    //Success
    await user.save();
    if (user) {
      return res.send({
        success: true,
        message: `User logged in successfully and ${message}`,
        accessToken: token,
      });
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { id, email } = req.decoded;

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }

    //Generate Access token

    const { error, token } = await generateJwt(email, id);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    user.accessToken = token;

    //Success
    const updatedToken = await user.save();
    if (updatedToken) {
      return res.send({
        success: true,
        message: `token refreshed`,
        accessToken: token,
      });
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        status: 400,
        error: true,
        message: "Cannot be processed",
      });
    }
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.send({
        success: true,
        message:
          "If that email address is in our database, we will send you an email to reset your password",
      });
    }

    let code = Math.floor(100000 + Math.random() * 900000);
    let response = await sendEmail(user.email, "RESET", code);

    if (response.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send mail. Please try again later.",
      });
    }

    let expiry = Date.now() + 60 * 1000 * 15;
    user.resetPasswordToken = code;
    user.resetPasswordExpires = expiry; // 15 minutes

    await user.save();

    return res.send({
      success: true,
      message:
        "If that email address is in our database, we will send you an email to reset your password",
    });
  } catch (error) {
    console.error("forgot-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(403).json({
        error: true,
        message:
          "Couldn't process request. Please provide all mandatory fields",
      });
    }
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.send({
        error: true,
        message: "Password reset token is invalid or has expired.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: true,
        message: "Passwords didn't match",
      });
    }
    const hash = await User.hashPassword(req.body.newPassword);
    user.password = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = "";

    await user.save();

    return res.send({
      success: true,
      message: "Password has been changed",
    });
  } catch (error) {
    console.error("reset-password-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    const { id } = req.decoded;

    let user = await User.findOne({ userId: id });

    user.accessToken = "";

    await user.save();

    return res.send({ success: true, message: "User Logged out" });
  } catch (error) {
    console.error("user-logout-error", error);
    return res.stat(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.UpdateUserProfile = async (req, res) => {
  try {
    const { email } = req.decoded;

    // find if any account with that email exists in DB
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // update user profile
    user.cardID = req.body.cardID || user.cardID;
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.company = req.body.company || user.company;
    user.title = req.body.title || user.title;
    user.headline = req.body.headline || user.headline;
    user.about = req.body.about || user.about;
    user.website = req.body.website || user.website;
    user.phone = req.body.phone || user.phone;
    user.emailPublic = req.body.emailPublic || user.emailPublic;
    user.socialLinks = req.body.socialLinks || user.socialLinks;

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      profileUrl: user.profileUrl,
      bannerUrl: user.bannerUrl,
      cardID: updatedUser.cardID,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      company: updatedUser.company,
      title: updatedUser.title,
      headline: updatedUser.headline,
      about: updatedUser.about,
      website: updatedUser.website,
      phone: updatedUser.phone,
      emailPublic: updatedUser.emailPublic,
      socialLinks: updatedUser.socialLinks,
      active: updatedUser.active,
    });
  } catch (err) {
    console.error("Update error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't update user profile",
    });
  }
};

exports.getUserProfilePrivate = async (req, res) => {
  try {
    const { email } = req.decoded;

    const user = await User.findOne({ email: email });

    if (user) {
      res.json({
        _id: user._id,
        cardID: user.cardID,
        profileUrl: user.profileUrl,
        bannerUrl: user.bannerUrl,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        title: user.title,
        headline: user.headline,
        about: user.about,
        website: user.website,
        phone: user.phone,
        emailPublic: user.emailPublic,
        email: user.email,
        socialLinks: user.socialLinks,
        active: user.active,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.getUserProfilePublic = async (req, res) => {
  try {
    const cardID = req.body.cardID;

    const user = await User.findOne({ cardID: cardID });

    if (user) {
      res.json({
        exists: true,
        _id: user._id,
        cardID: user.cardID,
        profileUrl: user.profileUrl,
        bannerUrl: user.bannerUrl,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        title: user.title,
        headline: user.headline,
        about: user.about,
        website: user.website,
        phone: user.phone,
        emailPublic: user.emailPublic,
        socialLinks: user.socialLinks,
        active: user.active,
      });
    } else {
      res.json({
        exists: false,
        message: "user not found",
      });
    }
  } catch (err) {
    console.error("error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't get profile. Please try again later.",
    });
  }
};

exports.downloadUserContact = async (req, res) => {
  try {
    const { cardID } = req.body;
    console.log(cardID);

    const user = await User.findOne({ cardID: cardID });

    if (user) {
      const details = {
        cardID: user.cardID,
        firstname: user.firstname,
        lastname: user.lastname,
        company: user.company,
        title: user.title,
        headline: user.headline,
        about: user.about,
        website: user.website,
        phone: user.phone,
        email: user.emailPublic,
        socialLinks: user.socialLinks,
        active: user.active,
      };
      const vcf = createVCF(details);
      res.setHeader("Content-Type", "text/vcard");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="contact.vcf"',
      );
      res.send(vcf);
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "Couldn't login. Please try again later.",
    });
  }
};

exports.uploadBanner = async (req, res) => {
  try {
    console.log("img", req.body);
    const { email } = req.decoded;
    const fileUrl = req.file.location;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // update user profile
    user.bannerUrl = fileUrl ? fileUrl : "";

    const updatedUser = await user.save();
    if (updatedUser) {
      res.json({
        success: true,
        url: fileUrl,
      });
    } else {
      res.json({
        success: false,
        message: "couldn't upload profile picture",
      });
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "couldn't upload profile picture",
    });
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    console.log("img", req.body);
    const { email } = req.decoded;
    const fileUrl = req.file.location;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // update user profile
    user.profileUrl = fileUrl ? fileUrl : "";

    const updatedUser = await user.save();
    if (updatedUser) {
      res.json({
        success: true,
        url: fileUrl,
      });
    } else {
      res.json({
        success: false,
        message: "couldn't upload profile picture",
      });
    }
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "couldn't upload profile picture",
    });
  }
};
