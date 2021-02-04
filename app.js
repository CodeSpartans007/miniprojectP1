const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongo_url = process.env.URL;

mongoose.connect(""+mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.set("useCreateIndex", true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const statesSchema = new mongoose.Schema ({
  Name  : String,
  Winter_M  :Number,
  Winter_m  :Number,
  Summer_M  :Number,
  Summer_m  :Number,
  Monsoon_M  :Number,
  Monsoon_m  :Number,
});

const fruitsSchema = new mongoose.Schema ({
  Name: String,
  Type: String,
  Temp_M: Number,
  Temp_m: Number,
  pH_M: Number,
  pH_m: Number,
  soil_type: String
});

const vegetablesSchema = new mongoose.Schema ({
  Name: String,
  Type: String,
  Temp_M: Number,
  Temp_m: Number,
  pH_M: Number,
  pH_m: Number,
  soil_type: String
});

const grainsSchema = new mongoose.Schema ({
  Name: String,
  Type: String,
  Temp_M: Number,
  Temp_m: Number,
  pH_M: Number,
  pH_m: Number,
  soil_type: String
});

var State = new mongoose.model("State",statesSchema);
var Fruit = new mongoose.model("Fruit", fruitsSchema);
var Vegetable = new mongoose.model("Vegetable", vegetablesSchema);
var Grain = new mongoose.model("Grain", grainsSchema);

// app.post("/",function(req,res){
//   var ppc1, ppc2, ppc3, vc1, vc2;
//   vc1= req.body.v1;
//   vc2= req.body.v2;
//   ppc1= req.body.pp1;
//   ppc2= req.body.pp2;
//   ppc3= req.body.pp3;
//   MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//       var dbp = db.db("elementfea");
//       var query = {$and:[{v2: vc2},{v1: vc1}]};
//       dbp.collection("Listfea").find(query).toArray(function(err, result1) {
//         if (err) throw err;
//         console.log(result1);
//       });
//       var dbo = db.db("elementList");
//       var query = {$and:[{pp3: Number(ppc3)},{pp2: Number(ppc2)},{pp1: Number(ppc1)}]};
//       dbo.collection("List").find(query).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//     });
//     db.close();
//     res.render("result");
//   });
// });


app.post("/",function(req,res){

  var vc1,pc1,pc2,WTM,WTm,STM,STm,MTM,MTm;
  vc1 = req.body.v1; //DATA OF STATE FROM HOMEPAGE
  pc1 = req.body.p1; //DATA OF SOIL pH LEVEL FROM HOMEPAGE
  pc2 = req.body.p2; //DATA OF SOIL TYPE FROM HOMEPAGE
  

  
  const query  = State.where({ Name : vc1 });
  query.findOne(function (err, fState) {
    if (err) return handleError(err);
    if (fState) {
      // doc may be null if no document matched
      WTM=fState.Winter_M;
      WTm=fState.Winter_m;
      STM=fState.Summer_M;
      STm=fState.Summer_m;
      MTM=fState.Monsoon_M;
      MTm=fState.Monsoon_m;
    }
  });

  Fruit.find(function(err, Fruitcard){
    if(err){
    console.log(err);
    }
    else{
      Vegetable.find(function(err, Vegetablecard){
        if(err){
        console.log(err);
        }
        else{
          Grain.find(function(err, Graincard){
            if(err){
            console.log(err);
            }
            else{
              res.render("result", {
                'fruit': Fruitcard, //FRUIT DATABASE
                'vegetable': Vegetablecard, //VEGETABLE DATABASE
                'grain': Graincard, //GRAIN DATABASE
                region: vc1, //STATE
                S_pH: pc1, //SOIL pH LEVEL
                S_Stype: pc2, //SOIL TYPE
                S_WTM: WTM, //MAX TEMP IN WINTER
                S_WTm: WTm, //MIN TEMP IN WINTER
                S_STM: STM, //MAX TEMP IN SUMMER
                S_STm: STm, //MIN TEMP IN SUMMER
                S_MTM: MTM, //MAX TEMP IN MONSOON
                S_MTm: MTm, //MIN TEMP IN MONSOON
              });
            }
          }); //GRAIN
        }
      }); //VEGETABLE
    }
  }); //FRUIT



});

app.get("/fruit", function(req, res){
  // res.render("fruit");

  Fruit.find(function(err, Fruitcard){
    if(err){
    console.log(err);
    }
    else{
      res.render("fruit", {'Fruit': Fruitcard});
    }
  });

});

app.get("/vegetable", function(req, res){
  // res.render("vegetable");

  Vegetable.find(function(err, Vegetablecard){
    if(err){
    console.log(err);
    }
    else{
      res.render("vegetable", {'Vegetable': Vegetablecard});
    }
  });

});

app.get("/grain", function(req, res){
  // res.render("fruit");

  Grain.find(function(err, Graincard){
    if(err){
    console.log(err);
    }
    else{
      res.render("grain", {'Grain': Graincard});
    }
  });

});

app.get("/", function(req, res){
  res.render("home");
});

app.listen(3000,function(){
  console.log("Server on Port 3000 running")
});
