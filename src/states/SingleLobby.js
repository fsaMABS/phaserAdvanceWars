import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.load.image('bg', 'assets/skies/deepblue.png')
  }

  create () {
    // this.state.start('Game')
    const firebase = this.game.firebase
    // console.log('*User', firebase.User())
    console.log('*database', firebase.database())
    console.log('this.game.lobby', this.game.lobby)
    console.log('this.lobby', this.lobby)
    var style = { font: '16px Courier', fill: '#fff', tabs: [ 164, 120, 80 ] }
    var text2 = this.game.add.text(32, 120, '', style)
    const buton = this.game.add.text(300, 300, 'WAITING FOR PLAYER 2', style)
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

      let text = this.game.add.text(32, 64, '', style)
      text.parseList(headings)

      // var text1 = 
      this.game.add.text(22, 30, 'Current user: ' + this.game.userId, style)
      text2.parseList(lobbylist)
      if (lobbylist.length === 2) {
        buton.setText('START GAME')
        buton.inputEnabled = true
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
