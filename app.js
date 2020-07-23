const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

/*
This is used to add a public static folder which our browser can
use to access our files which are locally situated
and we do not need to add "/" before the location
its considered that public copies everything and pastes as if
there is no public folder
*/
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/singup.html");
})

app.post("/signup", function(req, res) {
  // console.log(req.body.statusCode);
  const fName = req.body.fName;
  const lName = req.body.lName;
  const eName = req.body.eName;

  const data = {
    members: [{
      email_address: eName,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us17.api.mailchimp.com/3.0/lists/fa66c0f552';
  const options = {
    method: "POST",
    auth: "abhinav:1d5dd022b70189ca90e106f712598cfd-us17"
  }

  const request = https.request(url, options, function(response) {

    response.on("data", function(data) {
      var error = JSON.parse(data).error_count;
      console.log(error);
      if (error) {
        var error_name = JSON.parse(data).errors[0].error_code;
        console.log(error_name);
        res.sendFile(__dirname + "/public/html/failure.html")

      } else {
        res.sendFile(__dirname + "/public/html/success.html")
        console.log("success");
      }

    })
  });
  request.write(jsonData);
  request.end();
});

//Here we add a dynamic port which heroku changes as it desires
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is Started at 3000");
})

// API KEY
// 1d5dd022b70189ca90e106f712598cfd-us17

// List ID
// fa66c0f552
