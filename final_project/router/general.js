const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.passowrd;
  if (username && password) {
      if (!isValid(username)) { //if username does not exist
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User registered."})
      } else {
          return res.status(404).json({message: "Username exists."})
      }
  } else {
        return res.status(404).json({message: "Unfortunately, you are unable to register at the moment."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4)); //practice lab
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var author = req.params.author.replaceAll("+", " "); //replace spacebar with a plus sign in URL
    var authors = Object.keys(books); //obtain keys in the books object
    authors.forEach(function(key){ //iterate through each books array
        if(books[key].author == author) {
            return res.status(200).send(JSON.stringify(books[key]));
        }
    });
    return res.status(200).json({message: "Yet to be implemented!"});
    });

// Get all books based on title
//similar to task 3
public_users.get('/title/:title',function (req, res) {
    var title = req.params.title.replaceAll("+", " ");
    var titles = Object.keys(books);
    titles.forEach(function(key){
        if(books[key].title == title) {
            return res.status(200).send(JSON.stringify(books[key]));
        }
    });
    return res.status(200).json({message: "Yet to be implemented!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; //retreive review through ISBN (similar to task 2)
  res.send(JSON.stringify(books[isbn].reviews))
 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;


