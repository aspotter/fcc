const { init } = require("express/lib/application");

function ConvertHandler() {

  this.getNum = function (input) {
    
    num = input.match(/[.\d\/]+/g);
    if (!num) return 1;
    // prevent multiple divisions 'x/y/z'
    numArray = num[0].split('/');
    if (numArray.length > 2) {
      return 'invalid number'
    }
    const x = parseFloat(numArray[0]);
    const y = parseFloat(numArray[1]) || 1;
    let result = x / y;
    return result;
  };

  this.getUnit = function (input) {
    const units = ['gal', 'l', 'mi', 'km', 'lbs', 'kg']
    let result = input.match(/[a-zA-Z]+/g)[0].toLowerCase();
    if (!units.includes(result)) {
      return 'invalid unit';
    }
    if (result == 'l') {
      result = 'L';
    }
    return result;
  };

  this.getReturnUnit = function (initUnit) {
    const unitConversions = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    }
    result = unitConversions[initUnit];
    return result;
  };

  this.spellOutUnit = function (unit) {
    const unitNames = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    }
    result = unitNames[unit];
    return result;
  };

  this.convert = function (initNum, initUnit) {

    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        result = undefined;
    };

    return parseFloat(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
    return result;
  };

}

module.exports = ConvertHandler;
