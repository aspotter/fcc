const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
    suite('getNum(input) tests', () => {
        test('Whole number input', () => {
            assert.equal(convertHandler.getNum('10'), 10);
        });

        test('Decimal number input', () => {
            assert.equal(convertHandler.getNum('1.23456'), 1.23456);
        });

        test('Fractional input', () => {
            assert.equal(convertHandler.getNum('10/5'), 2);
        });

        test('Fractional input with a decimal', () => {
            assert.equal(convertHandler.getNum('10.5/5'), 2.1);
        });

        test('Double fraction input', () => {
            assert.equal(convertHandler.getNum('10/5/2'), 'invalid number');
        });

        test('No number in input defaults to 1', () => {
            assert.equal(convertHandler.getNum('ml'), 1);
        });
    });
    suite('getUnit(input) tests', () => {
        test('gal unit input', () => {
            assert.equal(convertHandler.getUnit('10gal'), 'gal');
        });

        test('L unit input', () => {
            assert.equal(convertHandler.getUnit('10l'), 'L');
        });

        test('mi unit input', () => {
            assert.equal(convertHandler.getUnit('10mi'), 'mi');
        });

        test('km unit input', () => {
            assert.equal(convertHandler.getUnit('10km'), 'km');
        });

        test('lbs unit input', () => {
            assert.equal(convertHandler.getUnit('10lbs'), 'lbs');
        });

        test('kg unit input', () => {
            assert.equal(convertHandler.getUnit('10kg'), 'kg');
        });

        test('invalid unit input', () => {
            assert.equal(convertHandler.getUnit('10bananas'), 'invalid unit');
        });
    });
    suite('getReturnUnit(initUnit) tests', () => {
        test('gal unit return', () => {
            assert.equal(convertHandler.getReturnUnit('gal'), 'L');
        });

        test('L unit return', () => {
            assert.equal(convertHandler.getReturnUnit('L'), 'gal');
        });

        test('mi unit return', () => {
            assert.equal(convertHandler.getReturnUnit('mi'), 'km');
        });

        test('km unit return', () => {
            assert.equal(convertHandler.getReturnUnit('km'), 'mi');
        });

        test('lbs unit return', () => {
            assert.equal(convertHandler.getReturnUnit('lbs'), 'kg');
        });

        test('kg unit return', () => {
            assert.equal(convertHandler.getReturnUnit('kg'), 'lbs');
        });
    });
    suite('spellOutUnit(unit) tests', () => {
        test('gal unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
        });

        test('L unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('L'), 'liters');
        });

        test('mi unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('mi'), 'miles');
        });

        test('km unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('km'), 'kilometers');
        });

        test('lbs unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('lbs'), 'pounds');
        });

        test('kg unit spellout', () => {
            assert.equal(convertHandler.spellOutUnit('kg'), 'kilograms');
        });
    });
    suite('convert(initNum, initUnit) tests', () => {
        test('gal to L', () => {
            assert.approximately(convertHandler.convert(10,'gal'), 37.8541, 0.001);
        });

        test('L to gal', () => {
            assert.approximately(convertHandler.convert(10, 'L'), 2.6417, 0.001);
        });

        test('mi to km', () => {
            assert.approximately(convertHandler.convert(10, 'mi'), 16.0934, 0.001);
        });

        test('km to mi', () => {
            assert.approximately(convertHandler.convert(10, 'km'), 6.21371, 0.001);
        });

        test('lbs kg', () => {
            assert.approximately(convertHandler.convert(10, 'lbs'), 4.53592, 0.001);
        });

        test('kg to lbs', () => {
            assert.approximately(convertHandler.convert(10, 'kg'), 22.0462, 0.001);
        });
    });
});