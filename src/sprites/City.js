import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, width, height, Def, Cap, player, id, team }) {
    super(game, x, y, asset)
    this.scale.setTo(0.9)
    this.width = width
    this.height = height
    this.Def = Def
    this.Cap = Cap
    this.player = player
    this.id = id
    this.team = team
  }

  update () {
  }
}
