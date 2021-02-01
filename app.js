const express = require('express');
const request = require('request');
const app = express();

//routes
app.get('/', (req,res)=>{
    res.send("You're home, welcome")
})

app.get('/access_token',access, (req,res)=>{
    res.status(200).json({access_token: req.access_token})
})

app.get('/register', access, (req, resp)=>{
    let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl'
    let auth = "Bearer " + req.access_token;

    request(
        {
            url: url,
            method: 'POST',
            headers:{
                'Authorization': auth
            },
            json:{
                 "ShortCode": "174379",
                "ResponseType": "Complete",
                "ConfirmationURL": "http://8000-af3b3cc2-a932-4b2d-b99f-8627725c54d9.ws-eu03.gitpod.io/confirmation",
                "ValidationURL": "http://8000-af3b3cc2-a932-4b2d-b99f-8627725c54d9.ws-eu03.gitpod.io/validation_url"
            }
        },
        function(error, response, body){
            if(error){console.log(error)}
            resp.status(200).json(body)
        }
    )
})











function access(req, res, next){
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    let auth =new Buffer('k4GSFax0gdSONmQpuAnXZde23fsHuGt2:BhSJBDUmIwlup98h').toString("base64");

    request({
        url:url,
        headers:{
            "Authorization": "Basic " + auth
        }
    },(error, response, body)=>{
        if(error){
            console.log(error)
        }else{
            // response
            req.access_token = JSON.parse(body).access_token
            next()
        }
    })
}

// listen
app.listen(8000, (err, live)=>{
    if(err){
        console.error(err)
    }
    console.log("Server running at port 8000")
});