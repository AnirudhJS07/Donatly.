//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const https = require("https");
const { url } = require("inspector");
const paypal = require('paypal-rest-sdk');


require('dotenv').config({ path: '.env' });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// add your username and password in string below
const mongo = process.env.MONGO_AUTH;
//mongoose.connect(mongo, {useNewUrlParser: true});

const donorSchema = {
  type : String,
  name : String,
  email : String,
  phone : String,
  password :String,
  dob : Date,
  gender : String,
  bloodGroup : String,
  rh: String,
  previousc: String,
  height: String,
  weight :String,
  previousd : String,
  fatherN :String,
  motherN :String,
  identity :String,
  document : Object,
  nominee1 : String,
  nominee2 :String,
  address :String,
  pincode :String,
  state: String,
  terms : Boolean
};

const contactSchema = {
  name: String,
  email: String,
  subject: String,
  message: String
};

const donationSchema = {
  amount :String,
  details : Array
}

const User = mongoose.model("User", donorSchema );
const Contact = mongoose.model("Contact" , contactSchema);
const Donation = mongoose.model("Donation" , donationSchema);


app.post("/form", function(req, res){

  const newUser = new User({
    type : req.body.type,
    name : req.body.name,
    email : req.body.email,
    phone : req.body.phone,
    password :req.body.password,
    dob : req.body.dob,
    gender : req.body.gender,
    bloodGroup : req.body.bloodGroup,
    rh: req.body.rh,
    previousc: req.body.previousc,
    height: req.body.height,
    weight :req.body.weight,
    previousd : req.body.previousd,
    fatherN :req.body.fatherN,
    motherN :req.body.motherN,
    identity :req.body.identity,
    document : req.body.document,
    nominee1 : req.body.nominee1,
    nominee2 :req.body.nominee2,
    address :req.body.address,
    pincode :req.body.pincode,
    state: req.body.state,
    terms : req.body.terms 
  });

  newUser.save(function(err){
    if (!err){
      res.render("/");
  }
  else{
    res.render("/form");
    console.log(err);
  }
  });
});




app.post("/contact", function(req, res){

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  });

  contact.save(function(err){
    if (!err){
      res.render("contact" ,{
      responseHead: "Success",
      responseBody: "We will revert back to you within 7 working days" 
    });
  }
  else{
    res.render("contact" ,{
      responseHead: "Failure",
      responseBody: "Please try again" 
    });
  }
  });
});




app.post("/newsletter",function(request,res){

  const email = request.body.email;

  const data = {
      members:[
          {
              email_address:email,
              status:"subscribed", 
              merge_fields:{
                FNAME:"def",
                LNAME:"def"
            }  
          }
      ]
  };

  const jsondata = JSON.stringify(data);

  const url = process.env.MAILCHIMP_ID;

  const options = {
      method:"POST",
      auth:process.env.MAILCHIMP_AUTH
  }

  const r = https.request(url, options, function(response){

      if((data)==0)
      {
          res.send("fail");
          console.log(data);
          console.log(data.error_count);
      }
      else{
          res.send("success")
      }

  })

  r.write(jsondata);
  r.end();

});



// paypal 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT,
  'client_secret': process.env.PAYPAL_SECRET
});

app.post('/donateus', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://donatly.herokuapp.com/success",
        "cancel_url": "http://donatly.herokuapp.com/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Redhock Bar Soap",
                "sku": "001",
                "price": req.body.amount,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": req.body.amount
        },
        "description": "Donations to donately"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});



});


app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

// Obtains the transaction details from paypal
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        // console.log(JSON.stringify(payment));
        res.send('Success');
        const newdonation = new Donation({
          details: JSON.stringify(payment)
        })

    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));







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

app.get("/recepients", function(req, res){
  res.render("recepients");
});

app.get("/donateus", function(req, res){
  res.render("donateus");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});



