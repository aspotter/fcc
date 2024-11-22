const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    /*
    Translation with text that needs no translation: POST request to /api/translate
    */

    suite('POST request tests', () => {
        test('Translation with text and locale fields: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    text: "Your favourite Dr Smith will meet you at the car boot sale at 12:45",
                    locale: 'british-to-american'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'text');
                    assert.strictEqual(res.body.text, "Your favourite Dr Smith will meet you at the car boot sale at 12:45")
                    assert.property(res.body, 'translation');
                    assert.strictEqual(res.body.translation, "Your <span class=\"highlight\">favorite</span> <span class=\"highlight\">Dr.</span> Smith will meet you at the <span class=\"highlight\">swap meet</span> at <span class=\"highlight\">12:45</span>")
                    done();
                })
        });
        test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    text: "Your favourite Dr Smith will meet you at the car boot sale at 12:45",
                    locale: 'german-to-french'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.strictEqual(res.body.error, 'Invalid value for locale field')
                    done();
                })
        });
        test('Translation with missing text field: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    locale: 'american-to-british'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.strictEqual(res.body.error, 'Required field(s) missing')
                    done();
                })
        });
        test('Translation with missing locale field: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    text: "Your favourite Dr Smith will meet you at the car boot sale at 12:45"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.strictEqual(res.body.error, 'Required field(s) missing')
                    done();
                })
        });
        test('Translation with empty text: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    text: "",
                    locale: 'british-to-american'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.strictEqual(res.body.error, 'No text to translate')
                    done();
                })
        });
        test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
            chai.request(server)
                .post('/api/translate')
                .send({
                    text: "hello, I am British",
                    locale: 'british-to-american'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'text');
                    assert.strictEqual(res.body.text, "hello, I am British")
                    assert.property(res.body, 'translation');
                    assert.strictEqual(res.body.translation, "Everything looks good to me!")
                    done();
                })
        });
    })
});
