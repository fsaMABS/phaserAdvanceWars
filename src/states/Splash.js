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
    this.load.image('infantry', 'assets/images/infantry.png')
    this.load.image('waitSprite', 'assets/images/wait.png')
    this.load.image('fireSprite', 'assets/images/fireSprite.png')
    this.load.image('target', 'assets/images/defenderTarget.png');
    this.load.tilemap('map', 'assets/js/secondMap.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('basicMap', 'assets/images/basicMap.png')
    this.load.image('greenSquare', 'assets/images/greenSquare.jpeg')
    this.load.image('blueSquare', 'assets/images/blueSquare.jpg')
    this.load.image('aw1Map', 'assets/images/aw1.bmp')
    // this.load.image('infantry')
  }

  create () {
    this.state.start('Game')
  }
}
