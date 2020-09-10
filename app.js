const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res) {
  res.sendFile(__dirname + "/test.html")
});

app.post("/game", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
