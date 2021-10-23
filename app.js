//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// add your username and password in string below
// mongoose.connect("mongodb+srv://admin-<username>:<password>@cluster0.4ady3.mongodb.net/hackathonMentalDB?retryWrites=true&w=majority", {useNewUrlParser: true});



app.get("/", function(req, res){
  res.render("index");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/form", function(req, res){
  res.render("form");
});

app.get("/read-more", function(req, res){
  res.render("readmore");
});

app.get("/bloodbanks", function(req, res){
  res.render("bloodbanks");
});

app.get("/organbanks", function(req, res){
  res.render("organbanks");
});

app.get("/hospitals", function(req, res){
  res.render("hospitals");
});

app.get("/oxygencylinders", function(req, res){
  res.render("oxygencylinders");
});

app.get("/organdonor", function(req, res){
  res.render("organdonor");
});

app.get("/blooddonor", function(req, res){
  res.render("blooddonor");
});

app.get("/blood_organrecepient", function(req, res){
  res.render("blood_organrecepient");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});



