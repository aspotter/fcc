class Collectible {
  constructor({ x = 10, y = 10, w = 24, h = 24, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.id = id;
  }
  // The game has at least one type of collectible item. 
  // Complete the Collectible class in Collectible.mjs to implement this.

  draw(ctx) {
    ctx.font = '24px "Material Symbols Outlined"';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('paid', this.x, this.y); 
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
