require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

// Security
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

// Game 
const io = socket(server);
const { canvasProps } = require('./public/canvas');
let coinId = 0;

let gameState = {
  players: [],
  coin: getNewCoin()
}

function getUniqueId() {
  return coinId++ + '';
}

function getNewCoin() {
  return {
    x: Math.floor(Math.random() * (canvasProps.playareaWidth - 50) + canvasProps.playareaMinX),
    y: Math.floor(Math.random() * (canvasProps.playareaHeight - 50) + canvasProps.playareaMinY),
    value: 1,
    id: getUniqueId()
  };
}



io.on('connection', socket => {
  console.log(`Player connected, id: ${socket.id}`)
  socket.emit('connected-msg', `You connected, id: ${socket.id}`);

  socket.on('update-player', playerObj => {
    console.log(playerObj)
    let newPlayersState = gameState.players.map(p => p.playerObj.id === playerObj.playerObj.id ? playerObj : p);
    const clientPlayer = gameState.players.filter(p => p.playerObj.id === playerObj.playerObj.id);

    if (clientPlayer.length === 0) {
      newPlayersState = [...newPlayersState, playerObj]
    }

    gameState.players = newPlayersState;

    console.log('server gamestate after update: ', gameState);

    io.emit('new-game-state', gameState);
  });

  socket.on('new-coin', (bool) => {
    if (bool) {
      gameState.coin = getNewCoin();
      io.emit('new-game-state', gameState);
    }
  });

  socket.on('disconnect', (data) => {
    let newPlayersState = gameState.players.filter(p => p.playerObj.id !== socket.id);
    gameState.players = newPlayersState;
    io.emit('new-game-state', gameState);
  })

})

module.exports = app; // For testing
