const express = require('express');
const request = require('request');
const app = express();

//routes
app.get('/', (req,res)=>{
    res.send("You're home, welcome")
})

app.get('/access_tokem',(req,res)=>{
    // access token
    let url = "";
    let auth =new Buffer().toString("base64");

    request({
        url:"",
        headers:{
            "Authorization": "Basic " + auth
        }
    },(error, response, body)=>{
        if(error){
            console.log(error)
        }else{
            res.status(200).json(body)
        }
    })
})



// listen
app.listen(8000, (err, live)=>{
    if(err){
        console.error(err)
    }
    console.log("Server running at port 8000")
});