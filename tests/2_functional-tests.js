/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('1. Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            "title": "My Book1"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.property(res.body, '_id', 'Book object should contain _id');
            done();
          });
      });
      
      test('2. Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be a string');
            assert.equal(res.body, 'missing required field title', 'An error message is responded');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('3. Test GET /api/books',  function(done){
        chai.request(server)
         .get('/api/books')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
           assert.property(res.body[0], 'title', 'Books in array should contain title');
           assert.property(res.body[0], '_id', 'Books in array should contain _id');
           done();
         });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('4. Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
         .get('/api/books/670e2da8f788c4001399b1af')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isString(res.body, 'response should be a string');
           assert.equal(res.body, 'no book exists', 'An error message is responded');
           done();
         });
      });
      
      test('5. Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
// ********** VALID _ID REQUIRED **********
         .get('/api/books/670f8e934e28134c6bf4f458')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.property(res.body, 'title', 'Book object should contain title');
           assert.property(res.body, '_id', 'Book object should contain _id');
           assert.property(res.body, 'comments', 'Book object should contain comments');
           done();
         });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('6. Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
// ********** VALID _ID REQUIRED **********
         .post('/api/books/670f8e934e28134c6bf4f458')
         .send({
          "comment": "Comment1"
        })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.property(res.body, 'title', 'Book object should contain title');
           assert.property(res.body, '_id', 'Book object should contain _id');
           assert.property(res.body, 'comments', 'Book object should contain comments');
           done();
         });
      });

      test('7. Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
// ********** VALID _ID REQUIRED **********
         .post('/api/books/670f8e934e28134c6bf4f458')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isString(res.body, 'response should be a string');
           assert.equal(res.body, 'missing required field comment', 'An error message is responded');
           done();
         });
      });

      test('8. Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
         .post('/api/books/670f8b773d406f49175b0563')
         .send({
          "comment": "Comment2"
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isString(res.body, 'response should be a string');
           assert.equal(res.body, 'no book exists', 'An error message is responded');
           done();
         });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('9. Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
// ********** VALID _ID REQUIRED **********
         .delete('/api/books/670f8fc3b7f0574daecd4f60')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isString(res.body, 'response should be a string');
           assert.equal(res.body, 'delete successful', 'An error message is responded');
           done();
         });
      });

      test('10. Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
         .delete('/api/books/670e2da8f788c4001399b1af')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isString(res.body, 'response should be a string');
           assert.equal(res.body, 'no book exists', 'An error message is responded');
           done();
         });
      });

    });

  });

});
