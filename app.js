const express = require("express");
const request = require("request");
const app = express();

// routes
app.get("/", (req, res) => {
  res.send("You're home. Welcome!");
});

app.get("/access_token", access, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

app.get("/register", access, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  let auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode:
          "600344" /*ShortCode 1:600344, shortCode 2: 600000, Test MSISDN: 254708374149  */,
        ResponseType: "Complete",
        ConfirmationURL: "http://105.163.2.137:80/confirmation",
        ValidationURL: "http://105.163.2.137:80/validation_url",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      res.status(200).json(body);
    }
  );
});

function access(req, res, next) {
  //access token
  let consumer_key = "k4GSFax0gdSONmQpuAnXZde23fsHuGt2";
  let consumer_secret = "BhSJBDUmIwlup98h";
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  let auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth,
      },
    },
    (error, response, body) => {
      // TODO: Use the body object to extract OAuth access token
      if (error) {
        console.log(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}

// listen
const PORT = 80;
app.listen(PORT, (err, live) => {
  if (err) {
    console.error(err);
  }
  console.log("Server is running at " + PORT);
});
