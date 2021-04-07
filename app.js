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
  soil_type1: String,
  soil_type2: String,
  soil_type3: String,
  soil_type4: String,
  soil_type5: String,
  soil_type6: String
});

const vegetablesSchema = new mongoose.Schema ({
  Name: String,
  Type: String,
  Temp_M: Number,
  Temp_m: Number,
  pH_M: Number,
  pH_m: Number,
  soil_type1: String,
  soil_type2: String,
  soil_type3: String,
  soil_type4: String,
  soil_type5: String,
  soil_type6: String
});

const grainsSchema = new mongoose.Schema ({
  Name: String,
  Type: String,
  Temp_M: Number,
  Temp_m: Number,
  pH_M: Number,
  pH_m: Number,
  soil_type1: String,
  soil_type2: String,
  soil_type3: String,
  soil_type4: String,
  soil_type5: String,
  soil_type6: String
});

const cropsSchema = new mongoose.Schema({
  State_Name: String,
  Season: String,
  Crop: String,
  pH: Number,
  Temp: Number,
  Rainfall: Number,
  Image: String,
  Crop_type: String,
  Soil_type1: String,
  Soil_type2: String,
  Soil_type3: String,
  Soil_type4: String,
  Soil_type5: String,
  Soil_type6: String
});

const allcropsSchema = new mongoose.Schema({
  Crop: String,
  pH: Number,
  Temp: Number,
  Rainfall: Number,
  Image: String,
  Crop_type: String,
  Soil_type1: String,
  Soil_type2: String,
  Soil_type3: String,
  Soil_type4: String,
  Soil_type5: String,
  Soil_type6: String
});

var State = new mongoose.model("State",statesSchema);
var Fruit = new mongoose.model("Fruit", fruitsSchema);
var Vegetable = new mongoose.model("Vegetable", vegetablesSchema);
var Grain = new mongoose.model("Grain", grainsSchema);
var Crop_recomdended = new mongoose.model("Crop_recomdended", cropsSchema);
var All_crop = new mongoose.model("All_crop", allcropsSchema);


app.post("/",function(req,res){
  
  var vc1,pc1,pc2,WTM,WTm,STM,STm,MTM,MTm;
  vc1 = req.body.v1; //DATA OF STATE FROM HOMEPAGE
  pc1 = req.body.p1; //DATA OF SOIL pH LEVEL FROM HOMEPAGE
  pc2 = req.body.p2; //DATA OF SOIL TYPE FROM HOMEPAGE
  vc1=String(vc1);
  console.log(vc1);
  
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
              Crop_recomdended.find(function(err, Cropcard){
                if(err){
                console.log(err);
                }
                else{

                  All_crop.find(function(err, Allcropcard){
                    if(err){
                    console.log(err);
                    }
                    else{


                  res.render("result", {
                    'fruit': Fruitcard, //FRUIT DATABASE
                    'vegetable': Vegetablecard, //VEGETABLE DATABASE
                    'grain': Graincard, //GRAIN DATABASE
                    'crop': Cropcard,
                    'acrop': Allcropcard,
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
              });//ALL CROP
                }
              }); //CROP
            }
          }); //GRAIN
        }
      }); //VEGETABLE
    }
  }); //FRUIT



});

app.get("/fruit", function(req, res){
  // res.render("fruit");

  All_crop.find(function(err, aCropcard){
    if(err){
    console.log(err);
    }
    else{
      res.render("fruit", {'acrop': aCropcard});
    }
  });

});

app.get("/vegetable", function(req, res){
  // res.render("vegetable");

  All_crop.find(function(err, aCropcard){
    if(err){
    console.log(err);
    }
    else{
      res.render("vegetable", {'acrop': aCropcard});
    }
  });

});

app.get("/grain", function(req, res){
  // res.render("fruit");

  All_crop.find(function(err, aCropcard){
    if(err){
    console.log(err);
    }
    else{
      res.render("grain", {'acrop': aCropcard});
    }
  });

});

app.get("/", function(req, res){
  res.render("home");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
  console.log("Server is running")
});
