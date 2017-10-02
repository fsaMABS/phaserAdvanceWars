import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ( x, y, data, width, height, type) {
    super(game, x, y, data)
    this.grid = [];
    this.reserveGrid = [];
    this.row = data.row
    this.col = data.col 
    this.width = width
    this.height = height
    this.type = type
  }

  update () {
    // this.angle += 1
  }
  reset(x,y,data) {
      this.loadTexture(data.asset);
      this.row = data.row
      this.col = data.col

  }
  makeTransparent() {
      this.alpha = 0.0
      return {x: this.x, y: this.y}
  }
}
