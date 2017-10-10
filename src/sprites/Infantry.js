import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, width, height, HP, AP, player, id, mobility, team, attackRadius }) {
    super(game, x, y, asset)
    this.width = width
    this.height = height
    this.HP = HP
    this.AP = AP
    this.player = player
    this.id = id
    this.mobility = mobility
    this.team = team
    this.attackRadius = attackRadius
  }

  update () {
  }
}
