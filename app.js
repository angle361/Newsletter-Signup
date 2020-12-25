const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // res.send("Good job");
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  //console.log(firstName, lastName);
  const data = {
    members: [
      //using key value pair which mailchimp can recognise
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      },
    ]

  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/850068c168";

  const options = {
    method: "POST",
    auth: "Sanyam:fe95e1914ba8cf9b4416545c1ee83489-us7"
  };
  const request = https.request(url, options, function (response) {   //we want to post data on external resource
    
    if(response.statusCode===200){
       // res.send("success");
       res.sendFile(__dirname + "/success.html");
    }
    else{
       // res.send("failure");
       res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});



app.post("/failure",function(req,res){
   res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {   //this process obj is defined by heroku
  console.log("server started");
});

//API key
//fe95e1914ba8cf9b4416545c1ee83489-us7    //{replce X with 7
//List ID
//850068c168
