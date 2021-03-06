"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

//http://localhost:3001/
const PORT = process.env.PORT || 3001;

//--------------------------------------<
const mongoose = require("mongoose");

let BookModel;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);

  const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    email: String,
  });

  BookModel = mongoose.model("Book", bookSchema);

  // addDummyData();
}
//-----------------------------------MongoDB>

async function addDummyData() {
  const book1 = new BookModel({
    title: "TESTBOOK title",
    description: "book5 description",
    status: "book5 status",
    email: "msdev24135@gmail.com",
  });

  const book2 = new BookModel({
    title: "TESTBOOK title",
    description: "book7 description",
    status: "book7 status",
    email: "msdev24135@gmail.com",
  });

  const book3 = new BookModel({
    title: "TESTBOOK3 title",
    description: "book9 description",
    status: "book9 status",
    email: "sajanader93@gmail.com",
  });

  await book1.save();
  await book2.save();
  await book3.save();
}
app.get("/", homeHandle);
app.get("/books", bookHandle);
app.post("/addBooks",addBook);
app.delete('/deleteBook/:id', deleteBook)
app.put('/updateBook/:id', updateBook)

function homeHandle(request, response) {
  response.send("Welcome to Backend Home!!");
}

function updateBook(request,response)
{
  const id = request.params.id;
  const email = request.query.email;
  const {title,description,status} = request.body;

  BookModel.findByIdAndUpdate(id,{title,description,status},(err,result)=>{
    BookModel.find({email: email}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        response.send(result);
        console.log('sending data back.....',result);
      }
    });
  })
}

function deleteBook(request,response){
  const id = request.params.id;
  const email = request.query.email;
  console.log(id,email);
  
  BookModel.deleteOne({_id:id},(err,result)=>{
    BookModel.find({email: email}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        response.send(result);
        console.log('sending data back.....',result);
      }
    });
  })
}

async function addBook(request,response){

  const {title,description,status,email} = request.body;

  await BookModel.create({title,description,status,email})

  BookModel.find({email: email}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      response.send(result);
      console.log('sending data back.....',result);
    }
  });
}

function bookHandle(request, response) {
  const userEmail = request.query.email;
  BookModel.find({email: userEmail}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      response.send(result);
    }
  });
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
