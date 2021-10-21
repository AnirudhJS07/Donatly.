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
mongoose.connect("mongodb+srv://admin-<username>:<password>@cluster0.4ady3.mongodb.net/hackathonMentalDB?retryWrites=true&w=majority", {useNewUrlParser: true});

const QuesSchema = {
  question: String,
  options: Object,
  Answer: String,
  img: String
};

const Question = mongoose.model("Question", QuesSchema);

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/", function(req, res){
  res.render("home");
});


app.get("/ar", function(req, res){
  res.render("ar");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/signup", function(req, res){
  res.render("signup");
});

app.get("/read", function(req, res){
  res.render("read");
});


app.get("/contact", function(req, res){
  res.render("contact");
});


app.get("/ar-1", function(req, res){
  res.render("ar-1");
});

app.get("/ar-2", function(req, res){
  res.render("ar-2");
});


app.get("/about", function(req, res){
  res.render("about");
});

app.get("/quiz", function(req,res){

  Question.find({}, function(err, questions){
    res.render("quiz", {questions: questions});
  });

});

app.post("/compose", function(req, res){

  const ques = new Question({
    question: req.body.question,
    option : {
      A : req.body.optiona,
      B : req.body.optionb,
      C : req.body.optionc,
      D : req.body.optiond
    },
  Answer: req.body.answer,
  img: req.body.img
  });


  ques.save(function(err){
    if(!err){
      res.redirect("/compose");
    }
    
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});



