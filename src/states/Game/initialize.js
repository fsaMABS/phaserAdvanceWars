import Infantry from '../../sprites/Infantry'
import {checkType} from '../../levels/level1'
import Block from '../../sprites/Block'

export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
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
    game: that.game,
    x: 512,
    y: 0,
    asset: 'mushroom',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2
  })
})

export const loadLevel = (that) => {
  console.log('showMoves', showMoves)
  that.map = that.add.tilemap('map')
  that.map.addTilesetImage('myMap', 'basicMap')
  that.level1 = that.map.createLayer('Tile Layer 1').resizeWorld()
  that.start = that.map.objects['Object1'][0]
  that.obj1 = that.map.createLayer('StartingPoint')

  that.pieces = startingPieces(that)

  for (var key in that.pieces) {
    let current = that.pieces[key]
    let added = that.game.world.add(current)
    added.inputEnabled = true
    added.events.onInputDown.add(showMoves(that), this)
    that.pieces[key] = added
    console.log(that.pieces[key].position)
  }

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 1
  that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
  that.blocks = that.add.group()

  for (var i = 0; i < 800; i = i + 32) {
    for (var j = 0; j < 800; j = j + 32) {
      var type = checkType(i, j)
      var block = new Block(i, j, 'blueSquare', 32, 32, type)
      block.alpha = 0.0
      that.blocks.add(block)
    }
  }
}

const showMoves = that => (sprite, event) => {
  that.selectedPiece = sprite
  if (that.currentPlayer === that.selectedPiece.player) {
    that.showingBlue = !that.showingBlue
    var alpha = that.showingBlue ? 0.5 : 0
    that.blocks.children.forEach((ele) => {
      if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < 160) {
        if (!(ele.x === sprite.x && ele.y === sprite.y)) {
          if (ele.type === 'land') {
            ele.alpha = alpha
            ele.inputEnabled = true
            ele.events.onInputDown.add(that.moveHere, that)
          }
        }
      }
    }, that)
  }
}

