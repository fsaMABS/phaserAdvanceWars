import Infantry from '../../sprites/Infantry'
import {checkType} from '../../levels/level1'
import Block from '../../sprites/Block'
import newGrid from '../../processMap'
console.log('grid in iintilize ', newGrid())
export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
    x: 0,
    y: 0,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 1
  }),
  2: new Infantry({
    game: that.game,
    x: 64,
    y: 0,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 2
  })
})

export const loadLevel = (that) => {
  that.background = that.game.add.sprite(0, 0, 'aw1Map')
  // that.background.width = 696;
  // that.background.height = 580;
  // that.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  that.scale.pageAlignHorizontally = true;
  that.scale.pageAlignVertically = true;
  that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);  
  that.attackButton = undefined;
  that.waitButton = undefined;
  that.healthStyle = { font: "30px Arial", fill: "#ffffff" };  

  that.pieces = startingPieces(that)
  
  for (var key in that.pieces) {
    let current = that.pieces[key]
    let added = that.game.world.add(current)
    added.inputEnabled = true
    added.events.onInputDown.add(showMoves(that), this)
    that.pieces[key] = added
    
    let pieceHealth = that.game.add.text(40, 40, that.pieces[key].HP, that.healthStyle);
    that.pieces[key].addChild(pieceHealth);
  }

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 1
  that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
  that.blocks = that.add.group()

  for (var i = 0; i < 3000; i = i + 32) {
    for (var j = 0; j < 3000; j = j + 32) {
      var type = checkType(i, j)
      var block = new Block(i, j, 'blueSquare', 32, 32, type)
      block.alpha = 0.0
      that.blocks.add(block)
    }
  }
}

const showMoves = that => (sprite, event) => {
  that.selectedPiece = sprite
  that.selectedPiece.moveAdded = false;
  if (that.currentPlayer === that.selectedPiece.player) {
    that.showingBlue = !that.showingBlue
    var alpha = that.showingBlue ? 0.5 : 0
    that.blocks.children.forEach((ele) => {
      if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < 160) {
        if (!(ele.x === sprite.x && ele.y === sprite.y)) {
          if (ele.type === 'land') {
            ele.alpha = alpha
            ele.inputEnabled = true
            // ele.events.onInputDown.add(that.sendMoveMessage, {that, selectedPieceId: sprite.id})
            if(!that.selectedPiece.moveAdded) ele.events.onInputDown.add((sprite) => that.moveHere(sprite), that)
          }
        }
      }
    }, that)
    that.selectedPiece.moveAdded = true;
  }
}
