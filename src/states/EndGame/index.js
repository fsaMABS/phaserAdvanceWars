import Phaser from 'phaser'
// import { centerGameObjects } from '../../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {
    const style = { font: "15px Arial", fill: "white" };
    const winner = 'player1'
    const text = `The game has now ended. Player ${winner} has won!`
    this.winnerText = this.add.text(this.game.world.centerX, this.game.world.centerY, text, style)    
    var timeLeft = 5
    const otherText = `You will be redirected back to the lobby in ${timeLeft} seconds`;    
    this.endingGame = this.add.text(this.game.world.centerX, this.game.world.centerY-50, otherText, style)     
    var clearId = setInterval(() => {
      if (timeLeft <= 1) {clearInterval(clearId)}
      this.endingGame.destroy()
      timeLeft--;
      this.endingGame = this.add.text(this.game.world.centerX, this.game.world.centerY-50, `You will be redirected back to the lobby in ${timeLeft} seconds`, style)           
    }, 1000)        
    setTimeout(() => {
      this.state.start('All_Lobbies')
      console.log('1 second passed')
    }, 5000);
  }
}
