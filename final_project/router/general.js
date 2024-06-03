const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === undefined || password === undefined) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] === undefined) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.status(200).json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  let author_books = {};

  for (let isbn in books) { 
    if (books[isbn].author.includes(author)) {
      author_books[isbn] = books[isbn];
    }
  }

  return res.status(200).json(author_books);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  let title_books = {};

  for (let isbn in books) { 
    if (books[isbn].title.includes(title)) {
      title_books[isbn] = books[isbn];
    }
  }

  return res.status(200).json(title_books);
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] === undefined) {
    return res.status(404).json({message: "Book not found"});
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
