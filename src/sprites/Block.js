import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ( x, y, data) {
    super(game, x, y, data)
    this.anchor.setTo(0.5)
    this.scale.setTo(0.25)
    this.grid = [];
    this.reserveGrid = [];
    this.row = data.row
    this.col = data.col
    // this.width = 50
    // this.height = 50
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
