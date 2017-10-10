import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.load.image('bg', 'assets/skies/deepblue.png')
  }

  create () {
    // this.state.start('Game')
    const firebase = this.game.firebase
    const tableTab = this.game.world.centerX-180;
    const tableTop = 130;
    const startTop = this.game.world.centerY+200
    const tabs = [220, 220, 80]

    this.background = game.add.tileSprite(0, 0,  config.gameWidth, config.gameHeight, 'background')
    this.bar = game.add.graphics();
    this.bar.beginFill(0x000000, 0.9);
    this.bar.drawRect(80, 80, 800, 640);

    const lobbyName = this.game.add.text(this.game.world.centerX, tableTop, this.game.lobby, { font: '34px Arial', fill: 'white', fontWeight: 'bold'})
    lobbyName.anchor.set(0.5)
    let style = { font: '24px Arial', fill: '#fff', tabs: tabs, align: 'center' }
    let headerStyle = { font: '24px Arial', fill: '#fff', tabs: tabs, fontWeight: 'bold', align: 'center' }
    let butonStyle = { font: '32px Arial', fill: '#fff', tabs: tabs, fontWeight: 'bold', align: 'center' }
    let playerReady = this.game.add.text(this.game.world.centerX, tableTop + 100, '', style)
    playerReady.anchor.set(0.5)
    const buton = this.game.add.text(this.game.world.centerX, startTop, 'WAITING FOR PLAYER 2', style)
    buton.anchor.set(0.5)
    firebase.database().ref('lobbies/' + this.game.lobby).on('value', snapshot => {
      console.log('****firebase***', snapshot.toJSON())
      const lobbies = snapshot.toJSON().players
      let currentUserKey
      var lobbylist = Object.keys(lobbies).map(key => {
        if (lobbies[key].username === this.game.userId) {
          currentUserKey = key
          this.game.currentUser = lobbies[key]
        }
        return [lobbies[key].username, lobbies[key].readyState, lobbies[key].role]
      })
      console.log('lobbylist', lobbylist)
      if (lobbylist[0][1] && lobbylist[1][1]) {
        // if both are ready, start the game
        this.state.start('MultiplayerGame')
        firebase.database().ref('lobbies/' + this.game.lobby).off()
      }

      var headings = [ 'Username', 'Ready?', 'role' ]

      let text = this.game.add.text(this.game.world.centerX, tableTop+60, '', headerStyle)
      text.parseList(headings)
      text.anchor.set(0.5)
      // this.game.add.text(22, 30, 'Current user: ' + this.game.userId, style)

      playerReady.parseList(lobbylist)
      if (lobbylist.length === 2) {
        buton.setText('START GAME')
        buton.inputEnabled = true
        buton.events.onInputOver.add(() => buton.alpha = 0.7, this)
        buton.events.onInputOut.add(() =>  buton.alpha = 1.0 , this)
        buton.events.onInputDown.removeAll()
        buton.events.onInputDown.add(() => {
          this.game.currentUser.readyState = true
          const newPlayerData = {
            players: Object.assign({}, lobbies, {
              [currentUserKey]: this.game.currentUser
            })
          }
          firebase.database().ref('lobbies/' + this.game.lobby).set(newPlayerData)
          if (!lobbylist[0][1] && !lobbylist[1][1]) {
            // if both not ready, set self to ready and wait
            buton.setText('WAITING FOR OTHER PLAYER...')
            buton.inputEnabled = false
          } else {
            // if both are ready, start the game
            this.state.start('MultiplayerGame')
            firebase.database().ref('lobbies/' + this.game.lobby).off()
          }
        }, this)
      }
    })
  }
}
