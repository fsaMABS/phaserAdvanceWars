import Phaser from 'phaser'
import config from '../config'
// import { centerGameObjects } from '../utils'

let textArray = []
export default class extends Phaser.State {
  init () {}

  preload () {
  }
  
  create () {
    this.background = game.add.tileSprite(0, 0,  config.gameWidth, config.gameHeight, 'background')
    this.bar = game.add.graphics();
    this.bar.beginFill(0x000000, 0.9);
    this.bar.drawRect(80, 80, 800, 640);
    const tableTab = 140;
    const tableTop = 220;
    const firebase = this.game.firebase
    const myId = window.prompt('What is your gameid?')
    this.game.userId = myId
    firebase.database().ref('lobbies').on('value', snapshot => {
      console.log('****firebase***', snapshot.toJSON())
      const lobbies = snapshot.toJSON()
      let lobbylist = Object.keys(lobbies).map(key => [key, Object.keys(lobbies[key].players).length])
      let style = { font: '24px Arial', fill: '#fff', tabs: [ 164, 120, 80 ] }
      let headings = [ 'Lobby', 'Players' ]
      let text = this.game.add.text(tableTab, tableTop, '', style)
      text.parseList(headings)
      textArray.forEach(text => text.destroy())
      textArray = []
      this.game.add.text(this.game.world.centerX-120, 100, 'Game Lobbies', { font: '34px Arial', fill: 'white', fontWeight: 'bold'})
      this.game.add.text(this.game.world.centerX-200, 160, 'Welcome, ' + myId + '!     Pick a lobby to join', style)
      const makelobby = (lobby, i) => {
        textArray[i] = this.game.add.text(tableTab+15, 60+ tableTop + (i * 40), '', style)
        textArray[i].parseList(lobby)
        textArray[i].lobby = lobby
        textArray[i].inputEnabled = true
        const handleClick = (text, pointer) => {
          if (text.lobby[1] > 1) return alert('Too many people')
          if (text.lobby[0] === 'New Lobby') {
            const newLobbyName = window.prompt('Name the new lobby!')
            firebase.database().ref('lobbies/' + newLobbyName).set({
              players: {
                1: {
                  username: myId,
                  readyState: false,
                  role: 'red'
                }
              }
            }) // created new lobby
            this.game.lobby = newLobbyName
          } else { // join existing lobby
            firebase.database().ref('lobbies/' + text.lobby[0] + '/players').push().set({
              username: myId,
              readyState: false,
              role: 'blue'
            })
            this.game.lobby = text.lobby[0]
          }
          this.state.start('SingleLobby')
          firebase.database().ref('lobbies').off()
        }
        textArray[i].events.onInputDown.add(handleClick, this)
        textArray[i].events.onInputOver.add(() => {
          textArray[i].alpha = 0.7;
        }, this)
        textArray[i].events.onInputOut.add(() => {
          textArray[i].alpha = 1.0
        }, this)
      }
      lobbylist.forEach(makelobby)
      makelobby(['New Lobby', 0], lobbylist.length)
    })
    // this.game.add.image(0, 0, 'bg')
  }
}
