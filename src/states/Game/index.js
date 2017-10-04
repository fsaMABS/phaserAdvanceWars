/* globals __DEV__ */
import Phaser from 'phaser'
import easystarjs from 'easystarjs'
import {loadLevel} from './initialize'
import io from 'socket.io-client'
import newGrid from '../../processMap'
console.log('grid in iintilize ', newGrid())
// var easystarjs = require('easystarjs')
var easystar = new easystarjs.js()


const socket = io(window.location.origin)
export default class extends Phaser.State {
  init () {
    this.showingBlue = false
    this.selectedPiece = undefined
  }

  create () {
    loadLevel(this)
  }

  togglePlayer () {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1
    // ENABLE PIECES
    for (var key in this.pieces) {
      if (this.pieces[key].player === this.currentPlayer) this.pieces[key].inputEnabled = true
      else this.pieces[key].inputEnabled = false
    }
    this.playerText.text = this.currentPlayer
  }
  sendMoveMessage (sprite) {
    if (this.showingBlue) {
      socket.emit('moveFromClient', {
        currentPlayer: this.currentPlayer,
        sprite: {x: sprite.x, y: sprite.y},
        selectedPieceId: sprite.id
      })
      this.showingBlue = false
    }
  }

  moveHere (sprite) {
    // console.log('SELECTED PIECE HERE', this.selectedPiece)
    this.blocks.children.forEach((ele) => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)

    if (this.selectedPiece.player === this.currentPlayer) this.changePosition = this.game.add.tween(this.selectedPiece)
    
      this.grid = []
    for (var i = 0; i < 25; i++) {
      this.grid.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])	
    }

    easystar.setGrid(newGrid());
    easystar.setAcceptableTiles([2]);
    console.log('before path', this.selectedPiece)

    //PROBLEM WITH EASY STAR ==> RUNNING ELSE STATEMENT TWICE FOR SAME PIECE, 
    // issue I think with it finding multiple pieces within that path and calling it for both
    easystar.findPath(this.selectedPiece.x/32, this.selectedPiece.y/32, sprite.x/32, sprite.y/32, ( path ) => {
      if (path === null) {
        alert("Path was not found.");
      } else {
        this.changePosition = this.game.add.tween(this.selectedPiece)          
        for (var i = 0 ; i < path.length; i++) {
          var currCoords = path[i]
          this.changePosition.to({x: currCoords.x*32, y: currCoords.y* 32}, 150) 
        }
        this.changePosition.start()
        this.changePosition.onComplete.add(function () {
          // this.changePosition.timeline = []
          this.sendMoveMessage(this.selectedPiece);
          this.checkForPieceOptions();
          this.disablePieceMovement(this.selectedPiece);
        }, this)
      }
    });
    easystar.calculate() 
  }

  checkForPieceOptions() {
    for(var key in this.pieces) {
      if(this.pieces[key] !== this.selectedPiece) {
        let diffX = Math.abs(this.pieces[key].position.x - this.selectedPiece.position.x)
        let diffY = Math.abs(this.pieces[key].position.y - this.selectedPiece.position.y)
        if((diffX === 32 && diffY === 0) || (diffX === 0 && diffY === 32))  {
          let defender = this.pieces[key]
          if(!this.attackButton || !this.attackButton.alive) {
            this.attackButton = this.game.add.button(this.game.world.centerX-64, this.game.world.centerY, 'mushroom', 
              () => this.attackPiece(defender), this, 2, 1, 0);
          }
        }
      }
    }
    if(!this.waitButton || !this.waitButton.alive) {
      this.waitButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'mushroom', this.wait, this, 2, 1, 0);
    }
  }

  attackPiece (defendingPiece) {
    this.selectedPiece
    this.selectedPiece.HP -= Math.floor(defendingPiece.AP / 2)
    defendingPiece.HP -= this.selectedPiece.AP

    for (var key in this.pieces) {
      console.log('HP of ' + key, this.pieces[key].HP)
    }
    this.selectedPiece.alpha = 0.7;
    this.disablePieceOptions();
  }

  disablePieceMovement(piece) {
    piece.inputEnabled = false;
  }

  disablePieceOptions() {
    if(this.waitButton) this.waitButton.destroy();
    if(this.attackButton) this.attackButton.destroy();
  }

  wait() {
    this.waitButton.pendingDestroy = true;
    this.selectedPiece.alpha = 0.7;
    this.disablePieceOptions();
  }

  endTurn() {
    console.log('Turn ended!');
    this.disablePieceOptions();
    var style = { font: '20px Arial', fill: '#fff' }
    this.turnEnded = this.game.add.text(this.game.world.centerX-32, this.game.world.centerY-32, "Turn Ended", style)
    this.time.events.add(100, () => {
      this.turnEnded.destroy()
      this.togglePlayer()
    }, this.turnEnded);
  }


  update () {
    this.enterKey.onDown.add(this.endTurn, this);

    //ALL PIECE UPDATES
    for (var piece in this.pieces) {
      //If dead: destroy it
      if (this.pieces[piece].HP <= 0) {
        this.pieces[piece].destroy()
        delete this.pieces[piece]
      }
      //Else: Update Health by Destroying Old Health and Rendering New
      else {
        this.pieces[piece].children[0].destroy() 
        let newHealth = this.game.add.text(40, 40, this.pieces[piece].HP, this.healthStyle)
        this.pieces[piece].addChild(newHealth);
      }
      
      //If piece is disabled, make it transparent --- but this turns off when it can't move
      //  so it looks disabled when the piece can still attack or what...
      this.pieces[piece].alpha = this.pieces[piece].inputEnabled === false ? 0.7 : 1.0
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}