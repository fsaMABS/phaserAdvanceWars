/* globals __DEV__ */
import Phaser from 'phaser'
import Infantry from '../sprites/Infantry'
import Block from '../sprites/Block'

export default class extends Phaser.State {
  init () {
    this.showingBlue = false
  }

  preload () {}

  create () {
    this.loadLevel()
    this.blocks = this.add.group()        
 
    // this.mushroomMovement = this.game.add.tween(this.mush1)
    // this.mush1.inputEnabled = true;
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

    this.pieces = {
      1: this.infantry1 = new Infantry({
        game: this.game,
        x: 608,
        y: 288,
        asset: 'mushroom',
        width: 32,
        height: 32,
        HP: 10,
        AP: 5
      }),
      2: this.infantry2 = new Infantry({
        game: this.game,
        x: 512,
        y: 0,
        asset: 'mushroom',
        width: 32,
        height: 32,
        HP: 10,
        AP: 5
      })
    }

    for(var key in this.pieces) {
      let current = this.pieces[key]
      let added = this.game.world.add(current);
      added.player = key % 2 >= 0 ? 1 : 2;
      added.inputEnabled = true;
      added.events.onInputDown.add(this.showMoves, this);
      this.pieces[key] = added;
    }
    console.log(this);

    var style = { font: '20px Arial', fill: '#fff' }
    this.game.add.text(410, 20, 'Player:', style)
    this.currentPlayer = 1
    this.playerText = this.game.add.text(480, 20, this.currentPlayer, style)
  }

  togglePlayer () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1

    if(this.currentPlayer === 1) {
      for(var key in this.pieces) {
        if(key % 2 >=0 ) this.pieces[key].inputEnabled = true;
      }
    }
    else if(this.currentPlayer === 2) {
      for(var key in this.pieces) {
        if(key % 2 === 0 ) this.pieces[key].inputEnabled = true;
      }
    }
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
      this.blocks.children.forEach((ele) => {
        ele.alpha = 0
        ele.inputEnabled = false
      }, this)

      //CHANGE THIS LATER TO WHATEVER THE SELECTED CHARACTER IS
      this.changePosition = this.currentPlayer === 1 
      ? this.game.add.tween(this.pieces[1]) 
      : this.game.add.tween(this.pieces[2])
      
      this.changePosition.to({x: sprite.x, y: sprite.y}, 350)
      this.changePosition.start()
      this.changePosition.onComplete.add(function () {
        this.changePosition.timeline = []
      }, this)

      button = game.add.button(game.world.centerX, game.world.centerY, 'mushroom', attackPiece, this, 2, 1, 0);
    }
    this.showingBlue = false
    this.togglePlayer()
  }

  attackPiece() {
    button.pendingDestroy = true;
    let attackingPiece;
    let defendingPiece;
    if(this.currentPlayer === 1) {

    }
    let attackingPiece = this.currentPlayer === 1 ? this.pieces[1] : this.pieces[2];
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}
