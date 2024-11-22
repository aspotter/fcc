const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const invalidPuzzle = '5.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzleChar = 'abcd.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidPuzzleLen = '....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {

    suite('Puzzle string tests', () => {
        test('Logic handles a valid puzzle string of 81 characters', () => {
            assert.equal(solver.validate(validPuzzle), 'valid');
        });
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
            assert.equal(solver.validate(invalidPuzzleChar), 'Invalid characters in puzzle');
        });
        test('Logic handles a puzzle string that is not 81 characters in length', () => {
            assert.equal(solver.validate(invalidPuzzleLen), 'Expected puzzle to be 81 characters long');
        });
    });
    suite('Row placement tests', () => {
        test('Logic handles a valid row placement', () => {
            assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
            assert.isTrue(solver.checkRowPlacement(validPuzzle, 4, 4, '3'));
            assert.isTrue(solver.checkRowPlacement(validPuzzle, 8, 8, '8'));
        });
        test('Logic handles an invalid row placement', () => {
            assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '8'));
            assert.isFalse(solver.checkRowPlacement(validPuzzle, 4, 4, '8'));
            assert.isFalse(solver.checkRowPlacement(validPuzzle, 8, 8, '9'));
        });
    });
    suite('Column placement tests', () => {
        test('Logic handles a valid column placement', () => {
            assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'));
            assert.isTrue(solver.checkColPlacement(validPuzzle, 4, 4, '3'));
            assert.isTrue(solver.checkColPlacement(validPuzzle, 8, 8, '8'));
        });
        test('Logic handles an invalid column placement', () => {
            assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, '9'));
            assert.isFalse(solver.checkColPlacement(validPuzzle, 4, 4, '5'));
            assert.isFalse(solver.checkColPlacement(validPuzzle, 8, 8, '4'));
        });
    });
    suite('Region placement tests', () => {
        test('Logic handles a valid region (3x3 grid) placement', () => {
            assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'));
            assert.isTrue(solver.checkRegionPlacement(validPuzzle, 4, 4, '3'));
            assert.isTrue(solver.checkRegionPlacement(validPuzzle, 8, 8, '8'));
        });
        test('Logic handles a invalid region (3x3 grid) placement', () => {
            assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '6'));
            assert.isFalse(solver.checkRegionPlacement(validPuzzle, 4, 4, '6'));
            assert.isFalse(solver.checkRegionPlacement(validPuzzle, 8, 8, '1'));
        });
    });
    suite('Solver tests', () => {
        test('Valid puzzle strings pass the solver', () => {
            assert.equal(solver.solve(validPuzzle), validSolution);
        });
        test('Invalid puzzle strings pass the solver', () => {
            assert.equal(solver.solve(invalidPuzzle), 'Unsolvable');
        });
        test('Solver returns the expected solution for an incomplete puzzle', () => {
            assert.equal(solver.solve(validPuzzle), validSolution);
        });
    });
});
