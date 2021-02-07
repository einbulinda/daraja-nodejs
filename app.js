const express = require("express");
const request = require("request");
const app = express();

// routes
app.get("/", (req, res) => {
  res.send("You're home. Welcome!");
});



app.get("/access_token",access, (req, res) => {
  res.status(200).json({access_token:req.access_token})
});

app.get('/register', access, (req, resp)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token;

    request({
        url: url,
        method:"POST",
        headers:{
            "Authorization": auth
        },
        json:{
            "ShortCode": "174379",
            "ResponseType": "Complete",
            "ConfirmationURL": "https://8000-gold-mouse-6vrfrv7i.ws-eu03.gitpod.io/confirmation",
            "ValidationURL": "https://8000-gold-mouse-6vrfrv7i.ws-eu03.gitpod.io/validation_url"
        }
    },
    function(error, response, body){
        if(error){console.log(error)}
        resp.status(200).json(body)
    }
    )    
})












function access(req, res, next){
//access token  
   let  consumer_key = "k4GSFax0gdSONmQpuAnXZde23fsHuGt2";
   let  consumer_secret = "BhSJBDUmIwlup98h";
   let url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
   let auth =
    "Basic " +
    new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth,
      },
    },
    (error, response, body)=> {
      // TODO: Use the body object to extract OAuth access token
      if(error){
          console.log(error)
      } else{
          req.access_token = JSON.parse(body).access_token;
          next();
      }
    }
  );
}

// listen
const PORT = 8000;
app.listen(PORT, (err, live) => {
  if (err) {
    console.error(err);
  }
  console.log("Server is running at " + PORT);
});
