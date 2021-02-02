const express = require("express");
var request = require("request");
const app = express();

// routes
app.get("/", (req, res) => {
  res.send("You're home. Welcome!");
});

app.get("/access_token", (req, res) => {
  //access token

  var request = require("request"),
    consumer_key = "k4GSFax0gdSONmQpuAnXZde23fsHuGt2",
    consumer_secret = "BhSJBDUmIwlup98h",
    url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth,
      },
    },
    function (error, response, body) {
      // TODO: Use the body object to extract OAuth access token
    }
  );
});

// listen
const PORT = 80;
app.listen(PORT, (err, live) => {
  if (err) {
    console.error(err);
  }
  console.log("Server is running at " + PORT);
});
