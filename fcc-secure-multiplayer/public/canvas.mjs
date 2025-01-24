const canvasWidth = 640;
const canvasHeight = 480;
const playerWidth = 50;
const playerHeight = 50;
const infoBar = 45;

const canvasProps = {
  canvasWidth: canvasWidth,
  canvasHeight: canvasHeight,
  playareaMinX: playerWidth / 2,
  playareaMinY: infoBar + playerHeight * 3/4,
  playareaWidth: canvasWidth,
  playareaHeight: canvasHeight - infoBar,
  playareaMaxX: canvasWidth - playerWidth / 2,
  playareaMaxY: canvasHeight, 
  infoBarHeight: infoBar,
  infoBarWidth: canvasWidth
};



export { canvasProps };