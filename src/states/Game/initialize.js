import Infantry from '../../sprites/Infantry'
import {checkType} from '../../levels/level1'
import Block from '../../sprites/Block'
import newGrid from '../../processMap'
import easystarjs from 'easystarjs'
var easystarz = new easystarjs.js()

export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
    x: 320,
    y: 320,
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 1,
    mobility: 5,
    team: 'blue'
  }),
  2: new Infantry({
    game: that.game,
    x: 320,
    y: 320+32,
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 2,
    mobility: 5,
    team: 'blue'
  }),
  3: new Infantry({
    game: that.game,
    x: 64,
    y: 32,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 2,
    mobility: 5,
    team: 'red'
  }),
  4: new Infantry({
    game: that.game,
    x: 32,
    y: 32,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 2,
    mobility: 5,
    team: 'red'
  }),
})

export const loadLevel = (that) => {
  that.background = that.game.add.sprite(0, 0, 'aw1Map')
  that.scale.pageAlignHorizontally = true;
  that.scale.pageAlignVertically = true;
  that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);  
  that.attackButton = undefined;
  that.waitButton = undefined;
  that.healthStyle = { font: "15px Arial", fill: "black" };  

  that.pieces = startingPieces(that)
  
  for (var key in that.pieces) {
    let current = that.pieces[key]
    let added = that.game.world.add(current)
    added.inputEnabled = true
    added.events.onInputDown.add(showMoves(that), this)
    that.pieces[key] = added
    
    let pieceHealth = that.game.add.text(10, 10, that.pieces[key].HP, that.healthStyle);
    that.pieces[key].addChild(pieceHealth);
  }

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 'red'
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
  console.log('teamin showmoves', that.selectedPiece.team)
  if (that.currentPlayer === that.selectedPiece.team) {
    that.showingBlue = !that.showingBlue
    var alpha = that.showingBlue ? 0.5 : 0
    var childrenPromises = that.blocks.children.map((ele) => {
      if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < (32 * sprite.mobility)) {
        if (!(ele.x === sprite.x && ele.y === sprite.y)) {
          if (ele.type === 'land') {
            easystarz.setGrid(newGrid())
            easystarz.setAcceptableTiles([2]);
            return new Promise((resolve, reject) => {
              easystarz.findPath(sprite.x/32, sprite.y/32, ele.x/32, ele.y/32, function( path ) {
                if (path === null || (path.length > sprite.mobility)) {
                  resolve(null)
                } else {
                  resolve(ele)
                }
              });
              easystarz.calculate()

            })
          }
        }
      }
    }, that)
      .filter(x => !!x)

    Promise.all(childrenPromises).then(elements => {
      if (that.showingBlue) {
        var inputEnabled = true
      } else {
        var inputEnabled = false
      }
      elements.forEach((ele) => {
        if (ele !== null ) {
          ele.alpha = alpha;
          ele.inputEnabled = inputEnabled          
          ele.events.onInputDown.add((sprite) => that.moveHere(sprite), that)
          if (ele.events.onInputDown._bindings.length > 1) {
            ele.events.onInputDown._bindings.shift()            
          }
        }
      })

    })

    that.selectedPiece.moveAdded = true;
  }
}
