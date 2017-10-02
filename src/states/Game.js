/* globals __DEV__ */
import Phaser from 'phaser'
import Infantry from '../sprites/Infantry'
import Block from '../sprites/Block'
// import EasyStar from 'easystarjs'
// var easystar = new EasyStar.js();

export default class extends Phaser.State {
  init () {
    this.showingBlue = false
  }

  preload () {}

  create () {
    this.blocks = this.add.group()
    this.pieces = {
      1: this.infantry1 = new Infantry({
        game: this.game,
        x: 775,
        y: 25,
        asset: 'mushroom',
        width: 23,
        height: 23,
        health: 10, 
        AP: 10
      }),
      2: this.infantry2 = new Infantry({
        game: this.game,
        x: 25,
        y: 775,
        asset: 'mushroom',
        width: 23,
        height: 23,
        health: 10,
        AP: 10
      })
    };
    console.log(this.pieces);

    this.mush1 = this.game.add.existing(this.infantry1)
    console.log('mush', this.infantry1);
    this.mush1.player = 1
    this.mush2 = this.game.add.existing(this.infantry2)
    this.mush2.player = 2
    this.mush1.inputEnabled = true
    this.mush1.events.onInputDown.add(this.showMoves, this)
    this.mush2.events.onInputDown.add(this.showMoves, this)

    for (var i = 25; i < 800; i = i + 25) {
      for (var j = 25; j < 800; j = j + 25) {
        this.createBlock(i, j, 'greenSquare')
      }
    }

    var style = { font: '20px Arial', fill: '#fff' }
    this.game.add.text(410, 20, 'Player:', style)
    this.game.add.text(540, 20, 'Fun:', style)
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
    if (sprite.player === this.currentPlayer) {
      var alpha = this.showingBlue ? 1 : 0.5
      this.blocks.children.forEach((ele) => {
        if (Math.abs(ele.x - sprite.x) < 125 && Math.abs(ele.y - sprite.y) < 125) {
          if (!(ele.x === sprite.x && ele.y === sprite.y)) {
            ele.alpha = alpha
            ele.inputEnabled = true
            ele.events.onInputDown.add(this.moveHere, this)
          }
        }
      }, this)
      this.showingBlue = !this.showingBlue
    }
  }

  createBlock (x, y, data) {
    var block = new Block(x, y, data)
    block.width = 23
    block.height = 23
    this.blocks.add(block)
  }

  moveHere (sprite, event) {
    if (this.showingBlue) {
      this.changePosition = this.currentPlayer === 1 ? this.game.add.tween(this.mush1) : this.game.add.tween(this.mush2)
      this.blocks.children.forEach((ele) => {
        ele.alpha = 1
        ele.inputEnabled = false
      }, this)
      this.changePosition.to({x: sprite.x, y: sprite.y}, 350)
      this.changePosition.start()
      this.changePosition.onComplete.add(function () {
        this.changePosition.timeline = []
      }, this)
      this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'mushroom', this.attackPiece, this, 2, 1, 0);
    }
    this.showingBlue = false
  }

  attackPiece() {
    this.button.pendingDestroy = true;
    let playerToAttack = this.currentPlayer === 1 ? 2 : 1;
    let attackingPlayer = this.currentPlayer === 1 ? 1 : 2;
    let pieceToAttack = playerToAttack === 1 ? this.mush1 : this.mush2;
    let attackingPiece = attackingPlayer === 1 ? this.mush2 : this.mush1;
    pieceToAttack.health -= attackingPiece.AP;
    this.togglePlayer()
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.infantry1, 32, 32)
    }
  }

  update() {
    //check current health
    this.mush1.health <= 0 ? this.mush1 = undefined : null;
    this.mush2.health <= 0 ? this.mush2 = undefined : null;
  }
}
