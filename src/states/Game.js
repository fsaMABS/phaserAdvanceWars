/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Block from '../sprites/Block'


export default class extends Phaser.State {
  init () {  
    this.showingBlue = false;
  }

  preload () {}

  create () {
    this.loadLevel()
    this.blocks = this.add.group()        
 
    this.mushroomMovement = this.game.add.tween(this.mush)
    this.mush.inputEnabled = true;
    this.mush.events.onInputDown.add(this.showMoves, this)
    this.game.input.onDown.add((pointer, event) => {
      var newX = Math.floor(pointer.clientX / 32) * 32
      var newY = Math.floor(pointer.clientY / 32) * 32      
      this.mushroom.x = newX;
      this.mushroom.y = newY;
    })
  }

  loadLevel() {
    this.map = this.add.tilemap('map')
    this.map.addTilesetImage('myMap', 'basicMap')
    this.level1 = this.map.createLayer("Tile Layer 1").resizeWorld()
    this.start = this.map.objects['Object1'][0]
    this.obj1 = this.map.createLayer("StartingPoint")
    this.mushroom = new Mushroom({
      game: this.game,
      x: 608,
      y: 288,
      asset: 'mushroom'
    })
    this.mushroom.height = 32;
    this.mushroom.width = 32;
    this.mush = this.game.world.addAt(this.mushroom, 1)    
  }

  showMoves(sprite, event) {
    // var alpha = this.showingBlue ? 1 : 0.5

    // this.blocks.children.forEach((ele) => {
    //   if (Math.abs(ele.x - sprite.x) < 125  && Math.abs(ele.y - sprite.y) < 125) {
    //     if (!(ele.x === sprite.x && ele.y === sprite.y)) {
    //       ele.alpha = alpha
    //       ele.inputEnabled = true;
    //       ele.events.onInputDown.add(this.moveHere, this)
    //     }
    //   }
    // }, this)
    // this.showingBlue = this.showingBlue ? false : true  
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
