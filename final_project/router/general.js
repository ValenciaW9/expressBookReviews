const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if(isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Task 1 & Task 10: Get all books using async-await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).json(JSON.stringify(allBooks));
  } catch(err) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 2 & Task 11: Get book by ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if(book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});

// Task 3 & Task 12: Get books by author using async-await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const matchingBooks = [];
      bookKeys.forEach(key => {
        if(books[key].author === author) {
          matchingBooks.push(books[key]);
        }
      });
      if(matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch(err) {
    return res.status(404).json({message: err});
  }
});

// Task 4 & Task 13: Get books by title using async-await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const matchingBooks = [];
      bookKeys.forEach(key => {
        if(books[key].title === title) {
          matchingBooks.push(books[key]);
        }
      });
      if(matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this title");
      }
    });
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch(err) {
    return res.status(404).json({message: err});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;