"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.get("/test", (request, response) => {
  response.send("test request received");
});
app.use(express.json());
//..................MONGOOOS...................
const mongoose = require("mongoose");
let booksModal;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB);

  const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    email: String,
  });

  booksModal = mongoose.model("books", bookSchema);

  // will uncomment this \/ function whin we need to save
  //seedData();
}

//.....\\.. to seed the modal..//......
async function seedData() {
  const cleanCode = new booksModal({
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description:
      "Programming is about polishing the craft with years of trial and error. I wish there was a way to save yourself from all the hard work by learning from the mistakes of other programmers? Fortunately, there is, and it is known to the world as the Clean Code: A Handbook of Agile Software Craftsmanship book from the legendary Uncle Bob.",
    status: true,
    email: "omar.nabeel.h@gmail.com",
  });
  const introductionToAlgorithms = new booksModal({
    title: "Introduction to Algorithms",
    description:
      "The name of the book is self-explanatory. It is what the title suggests, i.e., Introduction to Algorithms. Also known as CLRS, a reference to the last name of the authors of the book, it goes in-depth into a range of algorithms divided across several self-contained chapters.",
    status: false,
    email: "omar.nabeel.h@gmail.com",
  });
  const codeComplete = new booksModal({
    title: "Code Complete: A Practical Handbook of Software Construction",
    description:
      "Want to know how to write robust code irrespective of the architecture of a programming language? Then consider reading the Code Complete: A Practical Handbook of Software Construction. It comprehensively covers all the aspects of the structure of good code.",
    status: true,
    email: "omar.nabeel.h@gmail.com",
  });

  await cleanCode.save();
  await introductionToAlgorithms.save();
  await codeComplete.save();
}
//..............FINNISH WITH DB...............................

//..............ROUTS.........................................
app.get("/books", getBookHandler);

function getBookHandler(request, response) {
  let email = request.query.email;
  booksModal.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      response.send(result);
      console.log(result);
    }
  });
}

//..................and that's it...............................

app.post("/addbook", addBookHandler);

async function addBookHandler(req, res) {
  console.log("hi");
  console.log(req.body);
  const { title, description, status, email } = req.body;

  await booksModal.create({
    title: title,
    description: description,
    status: status,
    email: email,
  });

  booksModal.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

//.................................

app.delete("/deletebook/:id", deleteHandler);

function deleteHandler(req, res) {
  let bookId = req.params.id;
  let email = req.query.email;

  booksModal.deleteOne({ _id: bookId }, (err, result) => {
    booksModal.find({ email: email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
