import 'pixi'
import 'p2'
import Phaser from 'phaser'
import processMap from './processMap'
import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import SingleLobbyState from './states/SingleLobby'
import AllLobbiesState from './states/All_Lobbies'
import EndGameState from './states/EndGame'
import config from './config'

const firebase = require('firebase')
const FIREBASE_CONFIG = require('../server/config').FIREBASE_CONFIG
firebase.initializeApp(FIREBASE_CONFIG)

processMap()

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.firebase = firebase
    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('SingleLobby', SingleLobbyState, false)
    this.state.add('All_Lobbies', AllLobbiesState, false)
    this.state.add('Game', GameState, false)
    this.state.add('EndGame', EndGameState, false)
    this.state.start('Boot')
  }
}

window.game = new Game()
