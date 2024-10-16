/*
*#######################################################
*  Personal Library - 2024-10-16
*#######################################################
*/

'use strict';

// adding MongoDB/mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// setting up Schema and DB model
const Schema = mongoose.Schema;

// Issue model
const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    required: true,
    default: []
  },
  commentcount: {
    type: Number,
    required: true,
    default: 0
  }
});
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){

      // if req.params is empty
      if (Object.keys(req.params).length === 0) {

        try {
          // find all books in the database
          const allBooks = await Book.find({});

          // use only required fields for res.json
          const resAllBooks = allBooks.map(book => {
            return {
              title: book.title,
              _id: book._id,
              commentcount: book.commentcount
            };
          });
          return res.json(resAllBooks);

        } catch (err) {
          console.log(err);
        }
      }

    })
    
    .post(async function (req, res){
      const title = req.body.title;

      // if the required field is missing
      if (!title) {
        return res.json('missing required field title');
      }

      try {
        // save the new book in the database
        const newBook = new Book({title: title});
        const savedBook = await newBook.save();
        const resBookData = {
          _id: savedBook._id,
          title: savedBook.title
        };
  
        // Respond with the new user data
        return res.json(resBookData);

      } catch (err) {
        console.log(err);
      }
      
    })
    
    .delete(async function(req, res){
      try {
        const success = await Book.deleteMany({});

        if (success) {
          res.json("complete delete successful");
        } else {
          res.json("complete delete unsuccessful");
        }

      } catch (err) {
        console.log(err);
      }

    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      const _id = req.params.id;

      try {
        // retrieve the book data with the given id
        const bookFound = await Book.find({_id: _id});

        // if the book was found
        if (Object.keys(bookFound).length > 0) {
          const resBook = {
            _id: bookFound[0]._id,
            title: bookFound[0].title,
            comments: bookFound[0].comments
          };
          return res.json(resBook);

        // the book doesn't exist
        } else {
          return res.json("no book exists");
        }

      } catch (err) {
        console.log(err);
      }

    })
    
    .post(async function(req, res){
      const _id = req.params.id;
      const comment = req.body.comment;

      // try to find a book with the given _id
      try {
        const isFound = await Book.findOne({_id: _id});

        // if the book isn't found in the database
        if (!isFound) {
          return res.json("no book exists");
        }

      } catch (err) {
        console.log(err);
      }

      if (comment) {
        const updateFields = {
          $push: { comments : comment},
          $inc: { commentcount : 1 }
        };
  
        try {
          // find the book data by the given id and update data
          await Book.findOneAndUpdate(
            {_id: _id},
            updateFields
          );

          // findOneAndUpdate failed to return the updated doc...
          const bookUpdated = await Book.findOne({_id: _id});

          // respond with the formatted book data
          const resBook = {
            _id: bookUpdated._id,
            title: bookUpdated.title,
            comments: bookUpdated.comments
          };

          return res.json(resBook);

        } catch (err) {
          console.log(err);
        }

      // comment wasn't included
      } else {
        res.json("missing required field comment");
      }

    })
    
    .delete(async function(req, res){
      const _id = req.params.id;

      try {
        // find the book by the _id
        const isFound = await Book.findOne({_id: _id});

        // if the book exists
        if (isFound) {

          // delete the book
          const success = await Book.deleteOne({_id: _id});

          // if deletion was successful
          if (success) {
            res.json("delete successful");
          
          } else {          
            res.json("delete unsuccessful");
          }

        // the book doesn't exist
        } else {
          res.json("no book exists");
        }

      } catch (err) {
        console.log(err);
      }

    });
  
};
