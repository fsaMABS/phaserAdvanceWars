import Infantry from '../../sprites/Infantry'
import City from '../../sprites/City'
import Factory from '../../sprites/Factory'
import SmallTank from '../../sprites/SmallTank'
import Block from '../../sprites/Block'
import {startingPieces} from '../../maps/aw2'

// import newGrid from '../../maps/processMap'
import newGrid from '../../maps/aw2'

import easystarjs from 'easystarjs'
var easystarz = new easystarjs.js()
const setupPiece = (piece) => {
  piece.anchor.x = 0;
  piece.anchor.y = 0;
  piece.animations.add('explode');
}

export const loadLevel = (that) => {
that.background = that.game.add.sprite(0, 0, 'aw1Map')
that.scale.pageAlignHorizontally = true
that.scale.pageAlignVertically = true
that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
that.shiftKey = that.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
that.canEndTurn = true
that.attackButton = undefined
that.waitButton = undefined
that.healthStyle = { font: '18px Arial', fill: 'black', align: 'center'}
that.gameOver = false
that.winner = ''
that.explosions = game.add.group();
that.explosions.createMultiple(400, 'explode');
that.explosions.forEach(setupPiece, this);

var style = { font: '20px Arial', fill: '#fff' }
that.game.add.text(410, 20, 'Player:', style)
that.currentPlayer = 'red'
that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
that.blocks = that.add.group()
that.fog = that.add.group()
const isNear = (ele, sprite, dist) =>
  Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
for (var i = 0; i <= 928; i = i + 32) {
  for (var j = 0; j <= 768; j = j + 32) {
    var ourGrid = newGrid()
    var firstIndex = j/32;
    var secondIndex = i/32;
    var numberType = (ourGrid[firstIndex][secondIndex])
    var type;

    if (numberType === 0) {
      type = 'land'
    } else if (numberType ===  1) {
      type =  'water'
    } else if (numberType ===  2) {
      type =  'road'
    } else if (numberType ===  3) {
      type =  'mountain'
    } else if (numberType ===  4) {
      type =  'tree'
    }
    var block = new Block(i, j, 'blueSquare', 32, 32, type)
    block.alpha = 0.0
    that.blocks.add(block)
  }
}

that.pieces = startingPieces(that)
const revealedFog = []

for (var key in that.pieces) {
  let current = that.pieces[key]
  let added = that.game.world.add(current)
  added.inputEnabled = true
  if (added.key.indexOf('city') === -1) { added.events.onInputDown.add(showMoves(that), this) }
  if (added.isFactory) { added.events.onInputDown.add(makeTroops(that), this) }
  that.pieces[key] = added
  revealedFog.push({ x: current.position.x, y: current.position.y })

  if(that.pieces[key].key.indexOf('city') === -1) {
    let healthShape = that.game.add.graphics(30, 30);
    let pieceHealth = that.game.add.text(31, 31, that.pieces[key].HP, that.healthStyle)
    pieceHealth.anchor.set(1)

    healthShape.beginFill(0xffffff, 1);
    healthShape.drawRoundedRect(0,0,23,23,5)

    that.pieces[key].addChild(healthShape)
    that.pieces[key].addChild(pieceHealth)
  }
}
that.fog.children.map(ele => {
  revealedFog.forEach(fog => {
    if (ele.alpha && isNear(ele, fog, 10)) ele.alpha = 0
  })
})
return newGrid
}

const makeTroops = that => (sprite, event) => {
var isThereSomethingThere = false;
for (var key in that.pieces) {
  var currPieceX = that.pieces[key].position.x
  var factoryPositionX = sprite.position.x
  var currPieceY = that.pieces[key].position.y
  var factoryPositionY = sprite.position.y + 32
  if ((currPieceX === factoryPositionX) && (currPieceY === factoryPositionY)) {
    isThereSomethingThere = true
  }
}
console.log(isThereSomethingThere)  
if (!isThereSomethingThere) {
  var count = Object.keys(that.pieces).length;
  count = count + 1
  var newTank = new SmallTank({
    game: that.game,
    x: sprite.x,
    y: sprite.y + 32,
    asset: 'smallTank_red',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: count,
    mobility: 7,
    team: 'red',
    attackRadius: 1,
    troopType: 'smallTank',
    squareType: 'land'
  })
  let newTroop = that.game.world.add(newTank)
  that.pieces[newTroop.id] = newTroop
  newTroop.events.onInputDown.add(showMoves(that), this)
  console.log(that.pieces)  
}


}

const showMoves = that => (sprite, event) => {
// if (!that.selectedPiece) {
  that.selectedPiece = sprite
// } 
  console.log('hamecurrent user', that.currentPlayer,that.game.currentUser.role)
  console.log('selectedpiece team', that.selectedPiece.team)
if ((that.currentPlayer === that.selectedPiece.team) && (that.game.currentUser.role === that.selectedPiece.team)) {
  that.showingMoves = that.showingMoves !== true
  that.showingBlue = !that.showingBlue
  var alpha = that.showingBlue ? 0.5 : 0
  removeOtherShowMoves(that.pieces, sprite.id)
  var childrenPromises = that.blocks.children
    .map(ele => {
      if (
        Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) <
        32 * sprite.mobility
      ) {
          easystarz.setGrid(newGrid())
          switch (that.selectedPiece.troopType) {
            case 'smallTank':
              easystarz.setAcceptableTiles([0, 2])
              break
            case 'ship':
              easystarz.setAcceptableTiles([1])
              break
            default:
              easystarz.setAcceptableTiles([0, 2, 3, 4])
          }
          return new Promise((resolve, reject) => {
            easystarz.findPath(
              sprite.x / 32,
              sprite.y / 32,
              ele.x / 32,
              ele.y / 32,
              function (path) {
                if (path === null || path.length > sprite.mobility) {
                  resolve(null)
                } else {
                  resolve(ele)
                }
              }
            )
            easystarz.calculate()
          })
      }
    }, that)
    .filter(x => !!x)

  Promise.all(childrenPromises).then(elements => {
    let inputEnabled = !!that.showingBlue
    elements.forEach(ele => {
      if (ele !== null) {
        let pieceAlreadyHere = pieceIsAlreadyHere(that.pieces, ele.x, ele.y, sprite.id)
        if(!pieceAlreadyHere) {
          ele.alpha = alpha
          ele.inputEnabled = inputEnabled
          ele.events.onInputDown.add(sprite => that.moveHere(sprite), that)
          if (ele.events.onInputDown._bindings.length > 1) {
            ele.events.onInputDown._bindings.shift()
          }
        }
      }
    })
  })
}
}

const pieceIsAlreadyHere = (pieces, x, y, spriteId) => {
let check = false;
for(var key in pieces) {
  //if there's already a piece at X and Y and that piece isn't the current one
  if(x === pieces[key].position.x 
    && y === pieces[key].position.y 
    && pieces[key].id !== spriteId
    && pieces[key].key.indexOf('city') === -1
    ) 
    { 
      check = true;
  }
}
return check;
}

const removeOtherShowMoves = (pieces, spriteId) => {
for(var key in pieces) {
  if(pieces[key].id !== spriteId && pieces[key].key.indexOf('city') === -1) {
    pieces[key].events.onInputDown.remove(showMoves, this);
  }
}
}