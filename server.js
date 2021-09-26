"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());
server.use(express.json());
const { default: axios } = require("axios");
let PORT = 3001;
const mongoose = require("mongoose");
let movieModal;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb://Omar_Humamah:123Omar321@omarcluster-shard-00-00.reqod.mongodb.net:27017,omarcluster-shard-00-01.reqod.mongodb.net:27017,omarcluster-shard-00-02.reqod.mongodb.net:27017/favMove?ssl=true&replicaSet=atlas-104q19-shard-0&authSource=admin&retryWrites=true&w=majority`
  );

  const movieSchema = new mongoose.Schema({
    title: String,
    img: String,
    description: String,
    email: String,
  });

  movieModal = mongoose.model("favMovie", movieSchema);
}

server.get("/movies", gitMovies);
server.post("/addFav", addToFav);
server.get("/getFav", gitFavMovies);
server.delete("/delete/:id", deleteMove);
server.put("/update/:id", updateMovie);

function gitMovies(req, res) {
  axios
    .get(
      `https://api.themoviedb.org/3/movie/popular?api_key=d392d3ce0f9ceefcfd09b99d97173b24&language=en-US&page=1`
    )
    .then((result) => {
      res.send(result.data.results);
    })
    .catch((err) => console.log(err));
}

async function addToFav(req, res) {
  let { title, img, description, email } = req.body;

  await movieModal.create({
    title: title,
    img: img,
    description: description,
    email: email,
  });

  movieModal.find({ email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

function gitFavMovies(req, res) {
  let email = req.query.email;

  movieModal.find({ email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

function deleteMove(req, res) {
  let id = req.params.id;
  let email = req.query.email;

  movieModal.deleteOne({ _id: id }, (err, result) => {
    movieModal.find({ email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}

function updateMovie(req, res) {
  let id = req.params.id;
  let { title, description, email } = req.body;

  movieModal.findByIdAndUpdate(
    { _id: id },
    { title, description, email },
    (err, result) => {
      movieModal.find({ email }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }
  );
}

server.listen(PORT, () => console.log(`listening on 3001`));
