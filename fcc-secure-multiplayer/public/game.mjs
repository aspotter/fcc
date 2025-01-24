import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { canvasProps } from './canvas.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let clientPlayer;
let coin;
let allPlayers = [];

function getRandomStart() {
    return {
        x: Math.floor(Math.random() * (canvasProps.playareaWidth - 50) + canvasProps.playareaMinX),
        y: Math.floor(Math.random() * (canvasProps.playareaHeight - 50) + canvasProps.playareaMinY)
    }
}

socket.on('connect', () => {
    let startPos = getRandomStart();
    clientPlayer = new Player({
        x: startPos.x,
        y: startPos.y,
        id: socket.id
    });
    console.log('client player obj: ', clientPlayer)
    socket.emit('update-player', { playerObj: clientPlayer });
});

socket.on('connected-msg', message => {
    console.log(message);
});

socket.on('new-game-state', gameState => {
    update(gameState, clientPlayer);
})

function update(gameState, clientPlayer) {
    console.log('gamestate: ', gameState);
    move(clientPlayer)
    draw(gameState);
}

function draw(gameState) {
    console.log('draw gamestate: ', gameState);
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // set background first
    ctx.fillStyle = '#2A2E35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add banner on top
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvasProps.infoBarHeight);

    // text
    ctx.fillStyle = 'white';
    ctx.font = `14px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText('Controls: WASD', canvasProps.canvasWidth / 6, canvasProps.infoBarHeight * 3 / 4);

    ctx.font = `16px 'Press Start 2P'`;
    ctx.fillText('Coin Catcher', canvasProps.canvasWidth / 2, canvasProps.infoBarHeight * 3 / 4);

    console.log('coin to draw: ', gameState.coin)
    coin = new Collectible(gameState.coin);
    coin.draw(ctx);

    // remove and re-add updated player
    gameState.players.forEach(playerObj => {
        let playerProps = playerObj.playerObj
        console.log('player object before construct', playerProps)
        allPlayers = allPlayers.filter(p => p.id !== playerObj.playerObj.id)
        let newPlayer = new Player(playerProps);
        console.log('new player object after construct: ', newPlayer)
        allPlayers.push(newPlayer);
    })

    // Remove players from allPlayers if they no longer exist in gameState.players
    let gameStatePlayerIds = gameState.players.map(p => p.playerObj.id);
    allPlayers = allPlayers.filter(player => gameStatePlayerIds.includes(player.id));

    allPlayers.forEach(p => {
        console.log('player movement before draw func: ', p.movement)
        p.draw(ctx, coin, clientPlayer, allPlayers)

    })

    if (clientPlayer.collision(coin)) {
        clientPlayer.score += 1;
        socket.emit('new-coin', true);
    }
}

// player movement event listeners
const move = (player) => {
    const keyToDir = (e) => {
        if (e.keyCode === 87 || e.keyCode === 38) return 'up';
        if (e.keyCode === 83 || e.keyCode === 40) return 'down';
        if (e.keyCode === 65 || e.keyCode === 37) return 'left';
        if (e.keyCode === 68 || e.keyCode === 39) return 'right';
    };

    document.onkeydown = e => {
        let dir = keyToDir(e);

        if (dir) {
            // update player's movement object to true for direction
            player.startMove(dir);
            player.updateMoveXY();
            // Pass current player position and direction back to the server
            socket.emit('update-player', { playerObj: player });
        }
    };

    document.onkeyup = e => {
        let dir = keyToDir(e);

        if (dir) {
            // update player's movement object to false for direction
            player.stopMove(dir);
            player.updateMoveXY();
            // Pass current player position back to the server
            socket.emit('update-player', { playerObj: player });
        }
    };
};