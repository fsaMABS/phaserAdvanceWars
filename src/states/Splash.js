import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.tilemap('map', 'assets/js/secondMap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('basicMap', 'assets/images/basicMap.png')
    this.load.image('greenSquare', 'assets/images/greenSquare.jpeg')
    this.load.image('blueSquare', 'assets/images/blueSquare.jpg')
  }

  create () {
    this.state.start('Game')
  }
}
