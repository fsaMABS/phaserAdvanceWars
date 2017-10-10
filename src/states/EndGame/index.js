import Phaser from 'phaser'
import config from '../../config'
// import { centerGameObjects } from '../../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {
    this.background = game.add.tileSprite(0, 0,  config.gameWidth, config.gameHeight, 'background')
    this.bar = game.add.graphics();
    this.bar.beginFill(0x000000, 0.9);
    this.bar.drawRect(80, 80, 800, 640);
    const winnerStyle = { font: "64px Arial", fill: "white", fontWeight: 'bold', align: 'center' }
    const style = { font: "18px Arial", fill: "white", align: 'center' };
    const winner = 'player1'
    const text = `${winner} Wins!`
    this.winnerText = this.add.text(this.game.world.centerX, this.game.world.centerY-100, text, winnerStyle)
    this.winnerText.anchor.set(0.5)    
    var timeLeft = 5
    const otherText = `You will be redirected back to the main menu in ${timeLeft} seconds`;    
    this.endingGame = this.add.text(this.game.world.centerX, this.game.world.centerY+200, otherText, style)  
    this.endingGame.anchor.set(0.5)   
    var clearId = setInterval(() => {
      if (timeLeft <= 1) {clearInterval(clearId)}
      this.endingGame.destroy()
      timeLeft--;
      this.endingGame = this.add.text(this.game.world.centerX, this.game.world.centerY+200, `You will be redirected back to the main menu in ${timeLeft} seconds`, style)           
      this.endingGame.anchor.set(0.5)
    }, 1000)        
    setTimeout(() => {
      this.state.start('MainMenu')
      console.log('1 second passed')
    }, 5000);
  }
}