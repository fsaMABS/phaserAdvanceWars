/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Block from '../sprites/Block'
// import EasyStar from 'easystarjs'
// var easystar = new EasyStar.js();

export default class extends Phaser.State {
  init () {  
    this.showingBlue = false;
  }

  preload () {}

  create () {
    this.blocks = this.add.group()        
    this.mushroom = new Mushroom({
      game: this.game,
      x: 775,
      y: 25,
      asset: 'mushroom'
    })
    this.mush = this.game.add.existing(this.mushroom)
    this.mushroom.width = 23;
    this.mushroom.height = 23;
    this.mushroomMovement = this.game.add.tween(this.mush)
    this.mush.inputEnabled = true;
    this.mush.events.onInputDown.add(this.showMoves, this)
    for (var i = 25; i < 800; i = i + 25) {
      for (var j = 25; j < 800; j = j + 25) {
        this.createBlock(i, j, 'greenSquare')
      }
    }
  }

  showMoves(sprite, event) {
    var alpha = this.showingBlue ? 1 : 0.5
    this.blocks.children.forEach((ele) => {
      if (Math.abs(ele.x - sprite.x) < 125  && Math.abs(ele.y - sprite.y) < 125) {
        if (!(ele.x === sprite.x && ele.y === sprite.y)) {
          ele.alpha = alpha
          ele.inputEnabled = true;
          ele.events.onInputDown.add(this.moveHere, this)
        }
      }
    }, this)
    this.showingBlue = this.showingBlue ? false : true  
  }

  createBlock(x, y, data) {
      var block = new Block( x, y, data)
      block.width = 23;
      block.height = 23;
      this.blocks.add(block)
  }

  moveHere(sprite, event) {
    if (this.showingBlue) {
      this.blocks.children.forEach((ele) => {
            ele.alpha = 1
            ele.inputEnabled = false
      }, this)
      this.mushroomMovement.to({x: sprite.x, y: sprite.y}, 350)
      this.mushroomMovement.start()
      this.mushroomMovement.onComplete.add(function() {
        this.mushroomMovement.timeline.pop()        
      }, this)
    }
    this.showingBlue = false;
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
