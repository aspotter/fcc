const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('Routing tests', () => {
        test('GET /api/convert?input=... produces correct conversion', () => {
            chai
                .request(server)
                .get('/api/convert')
                .query({ input: '3.1mi' })
                .end((req, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.initNum, 3.1);
                    assert.equal(res.body.initUnit, 'mi');
                    assert.approximately(res.body.returnNum, 4.98895, 0.0001);
                    assert.equal(res.body.returnUnit, 'km');
                });
                
        });

        test('GET /api/convert?input=INVALID_UNIT produces correct response', () => {
            chai
                .request(server)
                .get('/api/convert')
                .query({ input: '32g' })
                .end((req, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'invalid unit')
                });
                
        });

        test('GET /api/convert?input=INVALID_NUM produces correct response', () => {
            chai
                .request(server)
                .get('/api/convert')
                .query({ input: '3/7.2/4kg' })
                .end((req, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'invalid number')
                });
                
        });

        test('GET /api/convert?input=INVALID_NUM_UNIT produces correct response', () => {
            chai
                .request(server)
                .get('/api/convert')
                .query({ input: '3/7.2/4kilomegagram' })
                .end((req, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, 'invalid number and unit')
                });
                
        });

        test('GET /api/convert?input=NO_NUM produces correct response', () => {
            chai
                .request(server)
                .get('/api/convert')
                .query({ input: 'kg' })
                .end((req, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.initNum, 1);
                    assert.equal(res.body.initUnit, 'kg');
                    assert.approximately(res.body.returnNum, 2.20462, 0.0001);
                    assert.equal(res.body.returnUnit, 'lbs');
                });     
        });
    });
});
