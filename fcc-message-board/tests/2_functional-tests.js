const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = chai

chai.use(chaiHttp);

let testThreadId;
let testReplyId;

suite('Functional Tests', function () {
  suite('Requests to /api/threads/{board}', function () {
    test('POST request to /api/threads/{board}', function (done) {
      chai.request(server)
        .post('/api/threads/tests')
        .send({ text: 'test-text', delete_password: 'test-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          expect(res).to.redirect;
          done();
        });
    });

    test('GET request to /api/threads/{board}', function (done) {
      chai.request(server)
        .get('/api/threads/tests')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array of threads');
          assert.isAtMost(res.body.length, 10, 'Maximum of 10 threads should be returned');
          assert.isObject(res.body[0], 'Threads should be objects');
          assert.equal(res.body[0].text, 'test-text');
          assert.isAtMost(res.body[0].replies.length, 3, 'Maximum of 3 replies should be returned');
          testThreadId = res.body[0]._id;
          done();
        });
    });

    test('DELETE request to /api/threads/{board}, invalid password', function (done) {
      chai.request(server)
        .delete('/api/threads/tests')
        .send({ thread_id: testThreadId, delete_password: 'invalid-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('PUT request to /api/threads/{board}', function (done) {
      chai.request(server)
        .put('/api/threads/tests')
        .send({ thread_id: testThreadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });
  });

  suite('Requests to /api/replies/{board}', function () {
    test('POST request to /api/replies/{board}', function (done) {
      chai.request(server)
        .post('/api/replies/tests')
        .send({ text: 'test-reply', thread_id: testThreadId, delete_password: 'test-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          expect(res).to.redirect;
          done();
        });
    });

    test('GET request to /api/replies/{board}', function (done) {
      chai.request(server)
        .get(`/api/replies/tests?thread_id=${testThreadId}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Response should be a single thread');
          assert.equal(res.body.text, 'test-text');
          assert.isArray(res.body.replies, 'Thread should have replies');
          assert.equal(res.body.replies[0].text, 'test-reply');
          testReplyId = res.body.replies[0]._id;
          done();
        });
    });

    test('DELETE request to /api/replies/{board}, invalid password', function (done) {
      chai.request(server)
        .delete('/api/replies/tests')
        .send({ thread_id: testThreadId, reply_id: testReplyId, delete_password: 'invalid-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('DELETE request to /api/replies/{board}, valid password', function (done) {
      chai.request(server)
        .delete('/api/replies/tests')
        .send({ thread_id: testThreadId, reply_id: testReplyId, delete_password: 'test-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

    test('PUT request to /api/replies/{board}', function (done) {
      chai.request(server)
        .put('/api/replies/tests')
        .send({ thread_id: testThreadId, reply_id: testReplyId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });
  });

  suite('Requests to /api/threads/{board}', function () {
    test('DELETE request to /api/threads/{board}, valid password', function (done) {
      chai.request(server)
        .delete('/api/threads/tests')
        .send({ thread_id: testThreadId, delete_password: 'test-password' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });
  });
});
