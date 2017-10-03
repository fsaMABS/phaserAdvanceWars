/* globals __DEV__ */
import Phaser from 'phaser'
import {loadLevel} from './initialize'

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
