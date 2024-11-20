/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        const books = await Book.find({});
        if (!books) {
          res.json([])
        };
        res.json(books);
      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })

    .post(async (req, res) => {
      try {
        let title = req.body.title;
        //response will contain new book object including atleast _id and title
        if (!title) {
          return res.send('missing required field title');
        };
        const newBook = await Book.create({ title: title });
        // respond with newly created book title and _id
        res.json({
          title: newBook.title,
          _id: newBook._id
        });
      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })

    .delete(async (req, res) => {
      try {
        //if successful response will be 'complete delete successful'
        const deleteBooks = await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        console.log('Error in DELETE request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      try {
        let bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        const book = await Book.findById({ _id: bookid }, '_id title comments');
        if (!book) {
          return res.send('no book exists')
        }
        res.json(book);

      } catch (err) {
        console.log('Error in GET request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      }
    })

    .post(async (req, res) => {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;

        if (!comment) {
          return res.send('missing required field comment');
        };
        // find book by id, push new comment to array and increment commentcount by 1
        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment }, $inc: { commentcount: 1 } },
          { new: true },
          '_id title comments'
        );

        if (!book) {
          return res.send('no book exists')
        };
        //json res format same as .get
        res.json(book);

      } catch (err) {
        console.log('Error in POST request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      };
    })

    .delete(async (req, res) => {
      try {
        let bookid = req.params.id;
        //if successful response will be 'delete successful'
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.send('no book exists')
        };
        res.send('delete successful')

      } catch (err) {
        console.log('Error in DELETE request: ', err);
        res.json({ error: 'An error occurred while processing your request' });
      }
    });

};
