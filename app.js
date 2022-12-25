const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const { request } = require("http");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    console.log(firstName, lastName, email);

    let data = {
        members: [
            {email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME : firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/fef58609ef";

    let options = {
        method : "POST",
        auth : "ajay018:a4f1fe23309b3afe6b634c7f8c42ff29-us21",
    };
    
    const request = https.request(url, options, function(response) {
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    // request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});

//API key => a4f1fe23309b3afe6b634c7f8c42ff29-us21
// list id => fef58609ef