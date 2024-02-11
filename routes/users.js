const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");

const AuthController = require("../src/users/user.controller");

// Configure AWS credentials
AWS.config.update({
  accessKeyId: "AKIAQRR636474BABWV64",
  secretAccessKey: "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",
});

// Create an S3 object
const s3 = new AWS.S3();

// Configure Multer middleware to handle file uploads
const uploadBanner = multer({
  storage: multerS3({
    s3: s3,
    bucket: "fractalcards-dev",
    acl: "public-read",
    key: (req, file, cb) => {
      cb(
        null,
        "banner/" + Date.now().toString() + path.extname(file.originalname),
      );
    },
  }),
});
const uploadProfile = multer({
  storage: multerS3({
    s3: s3,
    bucket: "fractalcards-dev",
    acl: "public-read",
    key: (req, file, cb) => {
      cb(
        null,
        "profiles/" + Date.now().toString() + path.extname(file.originalname),
      );
    },
  }),
});

router.post("/signup", cleanBody, AuthController.Signup);

router.post("/refreshToken", validateToken, AuthController.refreshToken);

router.post("/login", cleanBody, AuthController.Login);

router.patch("/forgot", cleanBody, AuthController.ForgotPassword);

router.patch("/reset", cleanBody, AuthController.ResetPassword);

// router.get("/referred", validateToken, AuthController.ReferredAccounts);

router.post(
  "/UpdateUserProfile",
  validateToken,
  AuthController.UpdateUserProfile,
);

router.post(
  "/getUserProfilePrivate",
  validateToken,
  AuthController.getUserProfilePrivate,
);

router.post(
  "/getUserProfilePublic",
  cleanBody,
  AuthController.getUserProfilePublic,
);

router.post(
  "/downloadUserContact",
  cleanBody,
  AuthController.downloadUserContact,
);

router.post(
  "/uploadBanner",
  validateToken,

  uploadBanner.single("bannerPicture"),

  AuthController.uploadBanner,
);
router.post(
  "/uploadProfile",
  validateToken,

  uploadProfile.single("profilePicture"),

  AuthController.uploadProfile,
);

module.exports = router;
