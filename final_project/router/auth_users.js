const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === undefined || password === undefined) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!isValid(username)) {
    return res.status(400).json({message: "User not registered"});
  }

  if (!authenticatedUser(username,password)) {
    return res.status(400).json({message: "Invalid username or password"});
  }

  const accessToken = jwt.sign({username: username}, 'fingerprint_customer');
  req.session.authorization = {accessToken: accessToken};
  return res.status(200).json({message: "User logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (books[isbn] === undefined) {
    return res.status(404).json({message: "Book not found"});
  }

  if (req.body.review === undefined) {
    return res.status(400).json({message: "Review is required"});
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added successfully"});
});

// Remove book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn] === undefined) {
    return res.status(404).json({message: "Book not found"});
  }

  if (books[isbn].reviews[username] === undefined) {
    return res.status(404).json({message: "Review not found"});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
