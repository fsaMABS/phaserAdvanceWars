import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, width, height, HP, AP, player, id, mobility, team, attackRadius, troopType, squareType}) {
    super(game, x, y, asset)
    this.scale.setTo(0.9)
    this.width = width
    this.height = height
    this.HP = HP
    this.AP = AP
    this.player = player
    this.id = id
    this.mobility = mobility
    this.team = team,
    this.troopType = troopType,
    this.squareType = squareType
    this.team = team
    this.attackRadius = attackRadius
    this.troopType = troopType
  }

  update () {
  }
}