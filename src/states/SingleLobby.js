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
    firebase.database().ref('lobbies/' + this.game.lobby).on('value', snapshot => {
      console.log('****firebase***', snapshot.toJSON())
      const lobbies = snapshot.toJSON().players
      var lobbylist = Object.keys(lobbies).map(key => [lobbies[key].username, lobbies[key].readyState])


      var headings = [ 'Username', 'Ready?' ]

      let text = this.game.add.text(32, 64, '', style)
      text.parseList(headings)

      // var text1 = 
      this.game.add.text(22, 30, 'Current user: ' + this.game.userId, style)
      var text2 = this.game.add.text(32, 120, '', style)
      text2.parseList(lobbylist)
    })
    // this.game.add.image(0, 0, 'bg')

    const buton = this.game.add.text(300, 300, 'START THE GAME', style)
    buton.inputEnabled = true
    buton.events.onInputDown.add(() => this.state.start('Game'), this)
  }
}
