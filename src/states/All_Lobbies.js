import Phaser from 'phaser'
// import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.load.image('bg', 'assets/skies/deepblue.png')
  }

  create () {
    const firebase = this.game.firebase
    const myId = window.prompt('What is your gameid?')
    this.game.userId = myId
    firebase.database().ref('lobbies').on('value', snapshot => {
      console.log('****firebase***', snapshot.toJSON())
      const lobbies = snapshot.toJSON()
      let lobbylist = Object.keys(lobbies).map(key => [key, Object.keys(lobbies[key].players).length])

      var style = { font: '16px Courier', fill: '#fff', tabs: [ 164, 120, 80 ] }

      var headings = [ 'Lobby', 'Players' ]

      let text = this.game.add.text(32, 64, '', style)
      text.parseList(headings)

      this.game.add.text(22, 30, 'Pick a lobby to join. Current user: ' + myId, style)
      const textArray = []
      const makelobby = (lobby, i) => {
        textArray[i] = this.game.add.text(32, 120 + i * 20, '', style)
        textArray[i].parseList(lobby)
        textArray[i].lobby = lobby
        textArray[i].inputEnabled = true
        const handleClick = (text, pointer) => {
          if (text.lobby[1] > 1) return alert('too many people')
          if (text.lobby[0] === 'New Lobby') {
            const newLobbyName = window.prompt('Name the new lobby!!!!')
            firebase.database().ref('lobbies/' + newLobbyName).set({
              players: {
                1: {
                  username: myId,
                  readyState: false
                }
              }
            }) // created new lobby
            this.game.lobby = newLobbyName
          } else { // join existing lobby
            firebase.database().ref('lobbies/' + text.lobby[0] + '/players').push().set({
              username: myId,
              readyState: false
            })
            this.game.lobby = text.lobby[0]
          }
          this.state.start('SingleLobby')
        }
        textArray[i].events.onInputDown.add(handleClick, this)
      }
      lobbylist.forEach(makelobby)
      makelobby(['New Lobby', 0], lobbylist.length)
    })
    // this.game.add.image(0, 0, 'bg')
  }
}
