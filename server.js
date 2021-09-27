"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());
server.use(express.json());
let PORT = process.env.PORT;
let {default: axios}= require('axios');
const mongoose = require('mongoose');
let flowersModal;
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB);

  const flowersSchema = new mongoose.Schema({
    name: String,
    instructions: String,
    photo: String,
    email: String
  });

  flowersModal = mongoose.model('flower', flowersSchema);
}



server.get('/getflowers', getFlowers);
server.post('/addtofav', addToFav);
server.get('/getfavflowers', getFavFlowers);
server.delete('/delete/:id', deleteFlower)
server.put('/update/:id', updateFlower )

function getFlowers(req, res){
  axios
  .get('https://flowers-api-13.herokuapp.com/getFlowers')
  .then(result=>{
    res.send(result.data.flowerslist)
  }
  )
}

async function addToFav (req, res){
  let email = req.query.email
  let {instructions, photo, name  } = req.body;
  
 await flowersModal.create({ 
  name: name,
  instructions: instructions,
  photo: photo,
  email: email
 })
 
 flowersModal.find({email}, (err, result)=>{
   if(err){
     console.log(err);
   }else{
     res.send(result)
   }
 })
}

function getFavFlowers (req, res){
  let email = req.query.email;
  flowersModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })
}

function deleteFlower(req, res){
let id = req.params.id;
let email = req.query.email;

flowersModal.deleteOne({_id:id}, (err, result)=>{
  flowersModal.find({email}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      res.send(result)
    }
  })
})

}

function updateFlower (req,res){
  let id = req.params.id;
  let email = req.query.email;
  let {name, instructions} = req.body;

  flowersModal.findByIdAndUpdate({_id:id}, {name, instructions}, (err, result)=>{
    flowersModal.find({email}, (err, result)=>{
      if(err){
        console.log(err);
      }else{
        res.send(result)
      }
    })
  })
}

server.listen(PORT, () => console.log(`listening on ${PORT}`));
