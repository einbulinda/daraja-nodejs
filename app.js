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
          "600344" /*ShortCode 1:600344 / 600383/601342, shortCode 2: 600000, Test MSISDN: 254708374149  */,
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

app.post("/confirmation", (req, res) => {
  console.log(".............confirmation..............");
  console.log(req.body);
});

app.post("/validation", (req, res) => {
  console.log("......................validation................");
  console.log(req.body);
});

// simulation request
app.get("/simulate", access, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
  let auth = "Bearer " + req.access_token;

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        ShortCode: "600344",
        CommandID: "CustomerPayBillOnline",
        Amount: "10000",
        Msisdn: "254708374149",
        BillRefNumber: "TestAPI",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

// Balance Query
app.get("/balance", access, (req, res) => {
  let endpoint =
    "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
  let auth = "Bearer " + req.access_token;

  request(
    {
      url: endpoint,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        Initiator: "apitest342",
        SecurityCredential:
          "M6LGymBtVhLILUxRESoODFeZjSafKGy17rRbwFSDQfEeCYz01lYF4DzBZE8JRIjEBFRQhog4HW76/y3ez5gl7HoV0r6bMfG0NaRVVD3ZNMwxxzwlL9WwgZ9980chbH5z166d5KJ1yeIRA5S2TZWMFC2ek/8lSTTbz/2oXkMEPWY3Fi5vVImz7PTddTChL7eizcoBC9yRB9ikBpGmmu6nHRVtM7bjQ5byTqNmzxRao8bA9o/WbFVDvlnM/Wt9f9C6viftqlaRyxPwfOkc6R0kyuE+qnG6N6rHqwjy1knMqZjnNH3tG9fXxo02noE2ZLwZ63k87keG+e6+5y7i9Iehhw==",
        CommandID: "AccountBalance",
        PartyA: "600344",
        IdentifierType: "4",
        Remarks: "Remarks",
        QueueTimeOutURL: "http://105.163.2.137:80/timeout_url",
        ResultURL: "http://105.163.2.137:80/result_url",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

app.post("/timeout_url", (req, res) => {
  console.log("----------Balance Response Timeout-----------");
  console.log(req.body);
});

app.post("/result_url", (req, res) => {
  console.log("----------Balance Response-----------");
  console.log(req.body.Result.ResultParameters);
});

// STK
app.get("/stk", access, (req, res) => {
  let endpoint =
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = "Bearer " + req.access_token;

  const timestamp = new Date()
    .toISOString()
    .substr(0, 19)
    .replace(/#|T|:|-|_/g, "");
  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  ).toString("base64");

  request(
    {
      url: endpoint,
      method: "POST",
      headers: { Authorization: auth },
      json: {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1",
        PartyA: "254702688826",
        PartyB: "174379",
        PhoneNumber: "254702688826",
        CallBackURL: "http://105.163.2.137:80/stk_callback",
        AccountReference: "Test",
        TransactionDesc: "Processed",
      },
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(body);
      }
    }
  );
});

app.post("stk_callback", (req, res) => {
  console.log("----------STK-----------");
  console.log(req.body.Body.stkCallback.CallbackMetadata);
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
