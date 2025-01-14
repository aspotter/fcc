const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET requests to /api/stock-prices/', function () {
        // Viewing one stock: GET request to /api/stock-prices/
        test('Test GET /api/stock-prices/ one stock', function (done) {
          chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: 'MSTR'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body.stockData, 'response should be an object');
              assert.equal(res.body.stockData.stock, 'MSTR', 'response should include stock ticker')
              assert.exists(res.body.stockData.price, 'response should have price for valid stock')
              done();
            });
        });
        // Viewing one stock and liking it: GET request to /api/stock-prices/
        test('Test GET /api/stock-prices/ one stock and like', function (done) {
            chai.request(server)
              .get('/api/stock-prices/')
              .query({
                  stock: 'NVDA',
                  like: 'true'
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body.stockData, 'response should be an object');
                assert.equal(res.body.stockData.stock, 'NVDA', 'response should include stock ticker')
                assert.exists(res.body.stockData.price, 'response should have price for valid stock')
                assert.equal(res.body.stockData.likes, 1, 'likes should equal 1')
                done();
              });
          });
        // Viewing the same stock and liking it again: GET request to /api/stock-prices/
        test('Test GET /api/stock-prices/ one stock and like', function (done) {
            chai.request(server)
              .get('/api/stock-prices/')
              .query({
                  stock: 'NVDA',
                  like: 'true'
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body.stockData, 'response should be an object');
                assert.equal(res.body.stockData.stock, 'NVDA', 'response should include stock ticker')
                assert.exists(res.body.stockData.price, 'response should have price for valid stock')
                assert.equal(res.body.stockData.likes, 1, 'repeated likes should still equal 1')
                done();
              });
          });
        // Viewing two stocks: GET request to /api/stock-prices/
        test('Test GET /api/stock-prices/ two stocks', function (done) {
            chai.request(server)
              .get('/api/stock-prices/')
              .query({
                  stock: ['AMZN', 'META']
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.isArray(res.body.stockData, 'stock data should be an array');
                assert.equal(res.body.stockData[0].stock, 'AMZN', 'response should include stock ticker');
                assert.exists(res.body.stockData[0].price, 'response should have price for valid stock');
                assert.equal(res.body.stockData[1].stock, 'META', 'response should include stock ticker');
                assert.exists(res.body.stockData[1].price, 'response should have price for valid stock');
                done();
              });
          });
        // Viewing two stocks and liking them: GET request to /api/stock-prices/
        test('Test GET /api/stock-prices/ two stocks and like', function (done) {
            chai.request(server)
              .get('/api/stock-prices/')
              .query({
                  stock: ['AMZN', 'META'],
                  like: 'true'
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.isArray(res.body.stockData, 'stock data should be an array');
                assert.equal(res.body.stockData[0].stock, 'AMZN', 'response should include stock ticker');
                assert.exists(res.body.stockData[0].price, 'response should have price for valid stock');
                assert.exists(res.body.stockData[0].rel_likes, 'response should have rel_likes');
                assert.equal(res.body.stockData[1].stock, 'META', 'response should include stock ticker');
                assert.exists(res.body.stockData[1].price, 'response should have price for valid stock');
                assert.exists(res.body.stockData[1].rel_likes, 'response should have rel_likes');
                done();
              });
          });
      });
    

});
