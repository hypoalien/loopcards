const AWS = require("aws-sdk");

// Replace this with your AWS S3 bucket name
const BUCKET_NAME = "fractalcards-dev";

// Replace this with your AWS S3 region
const REGION = "us-east-1";

// Replace this with your AWS access key ID
const ACCESS_KEY_ID = "AKIAQRR63647ZMINZ5MD";

// Replace this with your AWS secret access key
const SECRET_ACCESS_KEY = "nFL3yrUUmOFjqvrRZA/EgHbliY6hsOXMmuye/EMl";

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

const uploadImageToS3 = (file) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

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

module.exports = uploadImageToS3;
module.exports = createVCF;
