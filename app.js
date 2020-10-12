const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/elementList", {useNewUrlParser: true});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get("/", function(req, res){
  res.render("home");
});

app.post("/",function(req,res){
  var ppc1, ppc2, ppc3, vc1, vc2;
  vc1= req.body.v1;
  vc2= req.body.v2;
  ppc1= req.body.pp1;
  ppc2= req.body.pp2;
  ppc3= req.body.pp3;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("elementList");
    var query = {$and:[{pp3: Number(ppc3)},{pp2: Number(ppc2)},{pp1: Number(ppc1)}]};
    dbo.collection("List").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      res.render("result");
    });
  });

});

app.listen(3000,function(){
  console.log("Server on Port 3000 running")
});
