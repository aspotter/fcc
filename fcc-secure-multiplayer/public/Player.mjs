import { canvasProps } from './canvas.mjs';

class Player {
  constructor({ x = 100, y = 100, w = 48, h = 48, score = 0, id, primary, movement = { up: false, down: false, left: false, right: false } }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.score = score;
    this.id = id;
    this.primary = primary;
    this.movement = movement;
    this.speed = 5;
  }

  startMove(dir) {
    this.movement[dir] = true
  }

  stopMove(dir) {
    this.movement[dir] = false
  }

  movePlayer(dir, speed) {
    // Players can use the WASD and/or arrow keys to move their avatar. 
    // Complete the movePlayer method in Player.mjs to implement this.

    // The movePlayer method should accept two arguments: 
    // a string of "up", "down", "left", or "right", 
    // and a number for the amount of pixels the player's position should change. 
    // movePlayer should adjust the x and y coordinates of the player object it's called from.

    if (dir === 'up' && this.y - speed >= canvasProps.playareaMinY) {
      this.y -= speed;
    } else if (dir === 'down' && this.y + speed <= canvasProps.playareaMaxY) {
      this.y += speed;
    } else if (dir === 'left' && this.x - speed >= canvasProps.playareaMinX) {
      this.x -= speed;
    } else if (dir === 'right' && this.x + speed <= canvasProps.playareaMaxX) {
      this.x += speed;
    }

  };

  updateMoveXY() {
    console.log('client movement direction: ', this.movement)

    if (!this.movement) this.movement = {}


    // filter movement object for only directions === true (active)
    const activeDir = Object.keys(this.movement).filter(
      dir => this.movement[dir]
    );
    // apply movePlayer method for active directions
    console.log('before: ', this.x, this.y)
    activeDir.forEach(dir => this.movePlayer(dir, this.speed));
    console.log('after: ', this.x, this.y)
  }


  draw(ctx, coin, client, players) {


    // draw player icon to canvas for updated position
    if (this.id === client.id) {
      // update player rank text
      ctx.font = `14px 'Press Start 2P'`;
      ctx.fillStyle = 'white';
      ctx.fillText(this.calculateRank(players), canvasProps.canvasWidth * 5 / 6, canvasProps.infoBarHeight * 3 / 4);

      ctx.font = '48px "Material Symbols Outlined"';
      ctx.fillStyle = 'white';
      ctx.fillText('wallet', this.x, this.y);



    } else {
      // draw other player icon if not primary
      ctx.font = '48px "Material Symbols Outlined"';
      ctx.fillStyle = 'red';
      ctx.fillText('wallet', this.x, this.y);
    }



    // // update coin collision property on collision with player
    // if (this.collision(coin)) {
    //   // assign player's id to coin
    //   coin.collectedId = this.id;
    //   console.log('collision!')
    // }
  }

  collision(item) {
    // The collision method should accept a collectible item's object as an argument. 
    // If the player's avatar intersects with the item, the collision method should return true.
    if (
      this.x < item.x + item.w &&
      this.x + this.w > item.x &&
      this.y < item.y + item.h &&
      this.y + this.h > item.y
    )
      return true;

  }

  calculateRank(arr) {
    // The player's score should be used to calculate their rank among the other players. 
    // Complete the calculateRank method in the Player class to implement this.
    // The calculateRank method should accept an array of objects representing all connected players and 
    // [{
    //   id: player1,
    //   score: 100,
    //   ...
    // }, {
    //   id: player2,
    //   score: 10,
    //   ...
    // }]
    // return the string Rank: currentRanking/totalPlayers.
    // For example, in a game with two players, if Player A has a score of 3 and Player B has a score of 5, 
    // calculateRank for Player A should return Rank: 2/2.

    const playerCount = arr.length;

    // sort player arr by score to proxy rank
    const sortArr = arr.sort((a, b) => b.score - a.score);
    const playerRank = this.score === 0 ? arr.length : sortArr.findIndex(obj => obj.id === this.id) + 1;

    return `Rank: ${playerRank}/${playerCount}`

  }
}

export default Player;
