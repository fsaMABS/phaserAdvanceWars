import 'pixi'
import 'p2'
import Phaser from 'phaser'
import runthis from './processMap'
import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import io from 'socket.io-client'
import config from './config'


runthis()

const socket = io(window.location.origin)

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.start('Boot')
  }
}

window.game = new Game()


socket.on('connect', () => {
  console.log('Socket Connected!')
  socket.on('moveFromServer', obj => {
    // console.log('window.game', objc)
    console.log('obj.selectedPieceId', obj.selectedPieceId)
    //window.game.state.states.Game.moveHere(obj.sprite)
  })
})
