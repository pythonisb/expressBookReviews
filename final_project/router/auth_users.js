const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
let existingusers = users.filter((user)=>{
    return user.username === username
  });
  return (existingusers.length > 0);

}

const authenticatedUser = (username,password)=>{ 
let authorizedusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return (authorizedusers.length > 0);
}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error. Please try again!"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 4000 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User logged in. Welcome!");
  } else {
    return res.status(208).json({message: "Login unsuccessful. Please check username and password"});
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
      let registered_books = books[isbn];
      registered_books.reviews[username] = review;
      return res.status(200).send("Review submitted. Thanks!")
  } else {
      return res.status(404).json({message: "ISBN ${isbn} is invalid. Please try again!"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let registered_books = books[isbn];
        delete registered_books.reviews[username];
        return res.status(200).send("Reviewed deleted. Thanks!")
    } else {
        return res.status(404).json({message: "ISBN ${isbn} is invalid. Please try again!"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
