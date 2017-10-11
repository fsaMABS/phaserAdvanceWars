import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, width, height, HP, AP, player, id, mobility, team, AR, troopType, squareType }) {
    super(game, x, y, asset, width, height, HP, AP, player, id, mobility, team, AR, troopType, squareType )
    this.scale.setTo(0.9)
    this.width = width
    this.height = height
    this.HP = HP
    this.AP = AP
    this.player = player
    this.id = id
    this.mobility = mobility
    this.team = team
    this.AR = AR
    this.troopType = troopType
    this.squareType = this.squareType
  }

  update () {
  }
}
