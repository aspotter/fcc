const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const assertionAnalyser = require("../assertion-analyser");

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const invalidPuzzle = '5.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzleChar = 'abcd.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzleLen = '....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

chai.use(chaiHttp);
suite('Functional Tests', () => {
    suite('/api/solve POST tests', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', () => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: validPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'solution', 'success object should have solution property');
                    assert.equal(res.body.solution, validSolution, 'solution should be correct');
                });
        });
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', () => {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Required field missing', 'correct error response');
                });
        });
        test('Solve a puzzle with invalid characters: POST request to /api/solve', () => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidPuzzleChar })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle', 'correct error response');
                });
        });
        test('Solve a puzzle with incorrect length: POST request to /api/solve', () => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidPuzzleLen })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'correct error response');
                });
        });
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', () => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Puzzle cannot be solved', 'correct error response');
                });
        });
    });

    suite('/api/checl POST tests', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A2',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'valid', 'object should be contain valid');
                    assert.equal(res.body.valid, true, 'valid input is true');
                });
        });
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A2',
                    value: '8'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'valid', 'object should be contain valid');
                    assert.equal(res.body.valid, false, 'invalid input is false');
                    assert.property(res.body, 'conflict', 'object should have conflict');
                    assert.isArray(res.body.conflict, 'conflict should be an array');
                    assert.equal(res.body.conflict.length, 1, 'should return a single conflict');
                });
        });
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'E2',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'valid', 'object should be contain valid');
                    assert.equal(res.body.valid, false, 'invalid input is false');
                    assert.property(res.body, 'conflict', 'object should have conflict');
                    assert.isArray(res.body.conflict, 'conflict should be an array');
                    assert.equal(res.body.conflict.length, 2, 'should return 2 conflicts, row, region');
                    assert.equal(res.body.conflict[0], 'row', 'correct first conflict');
                    assert.equal(res.body.conflict[1], 'region', 'correct second conflict');
                });
        });
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'B5',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'valid', 'object should be contain valid');
                    assert.equal(res.body.valid, false, 'invalid input is false');
                    assert.property(res.body, 'conflict', 'object should have conflict');
                    assert.isArray(res.body.conflict, 'conflict should be an array');
                    assert.equal(res.body.conflict.length, 3, 'should return 3 conflicts, row, column, region');
                    assert.equal(res.body.conflict[0], 'row', 'correct first conflict');
                    assert.equal(res.body.conflict[1], 'column', 'correct second conflict');
                    assert.equal(res.body.conflict[2], 'region', 'correct third conflict');
                });
        });
        test('Check a puzzle placement with missing required fields: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Required field(s) missing', 'correct error response');
                });
        });
        test('Check a puzzle placement with invalid characters: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzleChar,
                    coordinate: 'A1',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle', 'correct error response');
                });
        });
        test('Check a puzzle placement with incorrect length: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzleLen,
                    coordinate: 'A1',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'correct error response');
                });
        });
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'Z99',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Invalid coordinate', 'correct error response');
                });
        });
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', () => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A1',
                    value: 'invalid'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, 'response body should be an object');
                    assert.property(res.body, 'error', 'object should be contain error');
                    assert.equal(res.body.error, 'Invalid value', 'correct error response');
                });
        });
    });
});

