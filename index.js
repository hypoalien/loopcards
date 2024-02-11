const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");

require("dotenv").config();
const PORT = 443;
var cors = require("cors");
const authRoutes = require("./routes/users");

var key = fs.readFileSync(path.resolve(__dirname, "../cert/custom.key"));
var cert = fs.readFileSync(path.resolve(__dirname, "../cert/cert.crt"));

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "TheNodeAuth",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection Success.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});
console.log();
app.use("/users", authRoutes);
https
  .createServer(
    {
      key: key,
      cert: cert,
    },
    app,
  )
  .listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
  });
