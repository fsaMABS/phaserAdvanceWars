/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import Block from '../sprites/Block'

export default class extends Phaser.State {
  init () {
    this.showingBlue = false
  }

  preload () {}

  create () {
    this.loadLevel()
    this.blocks = this.add.group()        
 
    this.mushroomMovement = this.game.add.tween(this.mush1)
    this.mush1.inputEnabled = true;
    // this.mush.events.onInputDown.add(this.showMoves, this)
    // this.game.input.onDown.add((pointer, event) => {
    //   var newX = Math.floor(pointer.clientX / 32) * 32
    //   var newY = Math.floor(pointer.clientY / 32) * 32      
    //   this.mushroom1.x = newX;
    //   this.mushroom1.y = newY;
    //   // this.showMoves()
    // })
    for (var i = 0; i < 800; i = i + 32) {		
      for (var j = 0; j < 800; j = j + 32) {		
        var newBlock = this.createBlock(i, j, 'blueSquare')		
      }		
    }
  }

  loadLevel () {
    this.map = this.add.tilemap('map')
    this.map.addTilesetImage('myMap', 'basicMap')
    this.level1 = this.map.createLayer('Tile Layer 1').resizeWorld()
    this.start = this.map.objects['Object1'][0]
    this.obj1 = this.map.createLayer('StartingPoint')
    this.mushroom1 = new Mushroom({
      game: this.game,
      x: 608,
      y: 288,
      asset: 'mushroom',
      width: 32,
      height: 32
    })
    this.mushroom2 = new Mushroom({
      game: this.game,
      x: 0,
      y: 0,
      asset: 'mushroom',
      width: 32,
      height: 32
    })
    this.mush1 = this.game.world.addAt(this.mushroom1, 1)
    this.mush1.player = 1
    this.mush2 = this.game.world.addAt(this.mushroom2, 1)
    this.mush2.player = 2
    this.mush1.inputEnabled = true
    this.mush1.events.onInputDown.add(this.showMoves, this)
    this.mush2.events.onInputDown.add(this.showMoves, this)
    var style = { font: '20px Arial', fill: '#fff' }
    this.game.add.text(410, 20, 'Player:', style)
    this.game.add.text(540, 20, 'misctext:', style)
    this.currentPlayer = 1
    this.playerText = this.game.add.text(480, 20, this.currentPlayer, style)
    this.funText = this.game.add.text(585, 20, '11', style)
  }
  togglePlayer () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
    this.mush1.inputEnabled = this.currentPlayer === 1
    this.mush2.inputEnabled = this.currentPlayer === 2
    this.playerText.text = this.currentPlayer
  }

  showMoves (sprite, event) {
    this.showingBlue = !this.showingBlue    
    var alpha = this.showingBlue ? 0.5 : 0
    this.blocks.children.forEach((ele) => {
      if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < 160) {
        if (!(ele.x === sprite.x && ele.y === sprite.y)) {
          ele.alpha = alpha
          ele.inputEnabled = true
          ele.events.onInputDown.add(this.moveHere, this)
        }
      }
    }, this)
  }

  createBlock (x, y, data) {
    var block = new Block(x, y, data, 32, 32)
    block.alpha= 0.0
    this.blocks.add(block)
  }

  moveHere (sprite, event) {
    if (this.showingBlue) {
      this.mushroomMovement = this.currentPlayer === 1 ? this.game.add.tween(this.mush1) : this.game.add.tween(this.mush2)
      this.blocks.children.forEach((ele) => {
        ele.alpha = 0
        ele.inputEnabled = false
      }, this)
      this.mushroomMovement.to({x: sprite.x, y: sprite.y}, 350)
      this.mushroomMovement.start()
      this.mushroomMovement.onComplete.add(function () {
        this.mushroomMovement.timeline = []
      }, this)
    }
    this.showingBlue = false
    this.togglePlayer()
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom1, 32, 32)
    }
  }
}
