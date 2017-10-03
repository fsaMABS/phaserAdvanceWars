/* globals __DEV__ */
import Phaser from 'phaser'
import easystarjs from 'easystarjs'
import {loadLevel} from './initialize'
import io from 'socket.io-client'
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
    }
    this.playerText.text = this.currentPlayer
  }
  sendMoveMessage (sprite) {
    console.log('sendmovemessage', this.selectedPieceId)
    const that = this.that
    if (that.showingBlue) {
      socket.emit('moveFromClient', {
        currentPlayer: that.currentPlayer,
        sprite: {x: sprite.x, y: sprite.y},
        selectedPieceId: this.selectedPieceId
      })
      that.showingBlue = false
    }
  }
  moveHere (sprite, selectedPieceId) {
    console.log('******movehere', this.pieces)

    // set selectedPiece
    console.log('selectedpIece', selectedPieceId)
    this.selectedPiece = this.pieces[+selectedPieceId]
    console.log('selectedpIece', this.selectedPiece)
    let button
    // janky fix for togglePlayer() running too early
    let attackPrompted = false

    this.blocks.children.forEach((ele) => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)

    if (this.selectedPiece.player === this.currentPlayer) this.changePosition = this.game.add.tween(this.selectedPiece)
    this.grid = []
    for (var i = 0; i < 10; i++) {
      this.grid.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,])	
    }
    easystar.setGrid(this.grid);
    easystar.setAcceptableTiles([0]);
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
    });
    easystar.calculate() 
  }


  attackPiece (button, defendingPiece) {
    button.pendingDestroy = true
    let attackingPiece = this.selectedPiece
    attackingPiece.HP -= Math.floor(defendingPiece.AP / 2)
    defendingPiece.HP -= attackingPiece.AP

    for (var key in this.pieces) {
      console.log('HP of ' + key, this.pieces[key].HP)
    }
    this.togglePlayer()
  }

  update () {
    // DESTROY PIECE FROM OBJECT IF HEALTH GONE
    for (var piece in this.pieces) {
      if (this.pieces[piece].HP <= 0) {
        this.pieces[piece].destroy()
        delete this.pieces[piece]
      }
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}
