const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let existing_users = users.filter((user) => user.username === username);
    if (existing_users.length != 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    let clear_users = users.filter((user) => (user.username === username) && (username.password === password));
    if (clear_users.length != 0) {
        return true;
    } else {
        return false;
    }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!password || !username) {
      return res.status(404).json({message: "Error. Please check your username and/or password."})
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
          {data: password},
          "access",
          {expiresIn: 60*60}
      );

      req.session.authorization = {
          accessToken, username
      };
      return res.status(200).send("User successfuly logged in. Welcome.");  
  } else {
      return res.status(208).send("Please check username or password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
