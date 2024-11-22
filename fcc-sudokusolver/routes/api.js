'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {
        puzzle,
        coordinate,
        value
      } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const validate = solver.validate(puzzle);
      if (validate !== 'valid') {
        return res.json({ error: validate });
      }

      const index = solver.coordToIndex(coordinate);
      if (!index) {
        return res.json({ error: 'Invalid coordinate' });
      } else {
        const row = index[0];
        const col = index[1];

        const rowCheck = solver.checkRowPlacement(puzzle, row, col, value);
        const colCheck = solver.checkColPlacement(puzzle, row, col, value);
        const regCheck = solver.checkRegionPlacement(puzzle, row, col, value);

        let conflict = [];
        if (!rowCheck) conflict.push('row');
        if (!colCheck) conflict.push('column');
        if (!regCheck) conflict.push('region');

        if (conflict.length !== 0) {
          return res.json({
            valid: false,
            conflict: conflict
          });
        } else {
          res.json({ valid: true });
        }
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validate = solver.validate(puzzle);
      if (validate !== 'valid') {
        return res.json({ error: validate });
      }

      const solution = solver.solve(puzzle);
      if (solution === 'Unsolvable') {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solution });

    });
};
