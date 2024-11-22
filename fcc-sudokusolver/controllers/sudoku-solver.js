class SudokuSolver {

  coordToIndex(coordinate) {
    // Validate the input for invalid characters
    if (!/^[A-I][1-9]$/.test(coordinate)) {
        return null;
    }

    // Map letters A-I to row indices 0-8
    const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

    // Convert the column number (1-9) to zero-based index (0-8)
    const col = parseInt(coordinate[1], 10) - 1;

    return [row, col];
}

  stringToBoard(puzzleString) {
    const board = [];
    // Convert puzzle string into a 9x9 2D array
    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
    }
    return board;
  }

  validate(puzzleString) {
    // no puzzle string
    if (!puzzleString) {
      return 'Required fields missing';
    }
    // length = 81
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    // only numbers 1-9 and .
    if (!/^[1-9.]{81}$/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    return 'valid';
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // convert to 2D array
    const board = this.stringToBoard(puzzleString);
    // check if given coord already contains value
    if (board[row][column] === value) {
      return true;
    }
    // test row for value
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // convert to 2D array
    const board = this.stringToBoard(puzzleString);
    // check if given coord already contains value
    if (board[row][column] === value) {
      return true;
    }
    // test column for value
    for (let i = 0; i < 9; i++) {
      if (board[i][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // convert to 2D array
    const board = this.stringToBoard(puzzleString);
    // check if given coord already contains value
    if (board[row][column] === value) {
      return true;
    }
    // test region for value
    for (let i = 0; i < 9; i++) {
      if (board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(column / 3) + (i % 3)] === value) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const SIZE = 9;

    // Convert the string into a 2D array
    const board = this.stringToBoard(puzzleString);

    // Check if placing a number at a given row, column or region is valid

    function isValid(row, col, num) {
      for (let i = 0; i < SIZE; i++) {
        if (board[row][i] === num || board[i][col] === num ||
          board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] === num) {
          return false;
        }
      }
      return true;
    }

    // Recursively solves the Sudoku board using backtracking

    function backtrack() {
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === '.') {
            for (let num = 1; num <= SIZE; num++) {
              const char = num.toString();
              if (isValid(row, col, char)) {
                board[row][col] = char;
                if (backtrack()) {
                  return true
                }
                board[row][col] = '.'; // Undo choice
              }
            }
            return false; // No valid number found
          }
        }
      }
      return true; // Fully solved
    }

    // Solve the board and return the result
    if (backtrack()) {
      return board.flat().join('');
    } else {
      return 'Unsolvable';
    }
  }
}


module.exports = SudokuSolver;

