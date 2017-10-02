/* globals __DEV__ */
import Phaser from 'phaser'
import Infantry from '../sprites/Infantry'
import Block from '../sprites/Block'
import {checkType} from '../levels/level1'

export default class extends Phaser.State {
  init () {
    this.showingBlue = false
    this.selectedPiece = undefined;
  }

  preload () {
    console.log('Preloading...');
  }

  create () {
    this.loadLevel()
    this.blocks = this.add.group()        
 
    // this.mushroomMovement = this.game.add.tween(this.mush1)
    // this.mush1.inputEnabled = true;
    // this.mush.events.onInputDown.add(this.showMoves, this)

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

      //NEED TO ADD TYPES TO THE NAME AT SOME POINT
      1: new Infantry({
        game: this.game,
        x: 608,
        y: 288,
        asset: 'mushroom',
        width: 32,
        height: 32,
        HP: 10,
        AP: 5,
        player: 1
      }),
      2: new Infantry({
        game: this.game,
        x: 512,
        y: 0,
        asset: 'mushroom',
        width: 32,
        height: 32,
        HP: 10,
        AP: 5,
        player: 2
      })
    }

    for(var key in this.pieces) {
      let current = this.pieces[key]
      let added = this.game.world.add(current);
      added.inputEnabled = true;
      added.events.onInputDown.add(this.showMoves, this);
      this.pieces[key] = added;
      console.log(this.pieces[key].position)
    }
    console.log(this);

    var style = { font: '20px Arial', fill: '#fff' }
    this.game.add.text(410, 20, 'Player:', style)
    this.currentPlayer = 1
    this.playerText = this.game.add.text(480, 20, this.currentPlayer, style)
  }

  togglePlayer () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
    //ENABLE PIECES
    for(var key in this.pieces) {
      if(this.pieces[key].player === this.currentPlayer) this.pieces[key].inputEnabled = true;
    }
    this.playerText.text = this.currentPlayer
  }

  showMoves (sprite, event) {
    this.selectedPiece = sprite;
    if(this.currentPlayer === this.selectedPiece.player) {
      this.showingBlue = !this.showingBlue    
      var alpha = this.showingBlue ? 0.5 : 0
      this.blocks.children.forEach((ele) => {
        if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < 160) {
          if (!(ele.x === sprite.x && ele.y === sprite.y)) {
            if (ele.type === 'land') {
              ele.alpha = alpha
              ele.inputEnabled = true
              ele.events.onInputDown.add(this.moveHere, this)
            }
          }
        }
      }, this)
    }
  }

  createBlock (x, y, data) {
    var type = checkType(x, y)
    var block = new Block(x, y, data, 32, 32, type)
    block.alpha= 0.0
    this.blocks.add(block)
  }

  moveHere (sprite, event) {
    if (this.showingBlue) {
      let button;
      //janky fix for togglePlayer() running too early
      let attackPrompted = false;

      this.blocks.children.forEach((ele) => {
        ele.alpha = 0
        ele.inputEnabled = false
      }, this)

      if(this.selectedPiece.player === this.currentPlayer) this.changePosition = this.game.add.tween(this.selectedPiece)
      
      this.changePosition.to({x: sprite.x, y: sprite.y}, 350)
      this.changePosition.start()
      this.changePosition.onComplete.add(function () {
        this.changePosition.timeline = []
        for(var key in this.pieces) {
          if(this.pieces[key] !== this.selectedPiece) {
            let diffX = Math.abs(this.pieces[key].position.x - this.selectedPiece.position.x)
            let diffY = Math.abs(this.pieces[key].position.y - this.selectedPiece.position.y)
            if((diffX === 32 && diffY === 0) || (diffX === 0 && diffY === 32))  {
              attackPrompted = true;
              const defender = this.pieces[key]
              button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'mushroom', 
                () => this.attackPiece(button, defender), this, 2, 1, 0);
            }
          }
        }
        if(!attackPrompted) this.togglePlayer();
      }, this)
    }
    this.showingBlue = false;
  }

  attackPiece(button, defendingPiece) {
    button.pendingDestroy = true;
    let attackingPiece = this.selectedPiece;
    attackingPiece.HP -= Math.floor(defendingPiece.AP/2);
    defendingPiece.HP -= attackingPiece.AP;

    for(var key in this.pieces) {
      console.log('HP of ' + key, this.pieces[key].HP);
    }
    this.togglePlayer();
  }

  update() {
    //DESTROY PIECE FROM OBJECT IF HEALTH GONE
    for(var piece in this.pieces) {
      if(this.pieces[piece].HP <= 0) {
        this.pieces[piece].destroy();
        delete this.pieces[piece];
      } 
    }
  }

  render () {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}
