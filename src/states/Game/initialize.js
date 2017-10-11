import Block from '../../sprites/Block'
import newGrid, {startingPieces} from '../../maps/aw2'
import easystarjs from 'easystarjs'
var easystarz = new easystarjs.js()

export const loadLevel = (that) => {
  that.background = that.game.add.sprite(0, 0, 'aw1Map')
  that.scale.pageAlignHorizontally = true
  that.scale.pageAlignVertically = true
  that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  that.shiftKey = that.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
  that.canEndTurn = true
  that.attackButton = undefined
  that.waitButton = undefined
  that.healthStyle = { font: '18px Arial', fill: 'black' }
  that.gameOver = false
  that.winner = ''

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 'blue'
  that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
  that.blocks = that.add.group()
  that.fog = that.add.group()
  const isNear = (ele, sprite, dist) =>
    Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
  for (var i = 0; i <= 928; i = i + 32) {
    for (var j = 0; j <= 768; j = j + 32) {
      var ourGrid = newGrid()
      // console.log('GRIDDD', ourGrid, i, j )
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
    that.pieces[key] = added
    revealedFog.push({ x: current.position.x, y: current.position.y })

    let pieceHealth = that.game.add.text(
      20,
      20,
      that.pieces[key].HP,
      that.healthStyle
    )
    that.pieces[key].addChild(pieceHealth)
  }
  that.fog.children.map(ele => {
    revealedFog.forEach(fog => {
      if (ele.alpha && isNear(ele, fog, 10)) ele.alpha = 0
    })
  })
  return newGrid
}

const showMoves = that => (sprite, event) => {
  if (!that.selectedPiece) that.selectedPiece = sprite
  if (that.currentPlayer === that.selectedPiece.team) {
    that.showingMoves = that.showingMoves !== true
    that.showingBlue = !that.showingBlue
    var alpha = that.showingBlue ? 0.5 : 0
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
              // console.log('sprite coords', sprite.x / 32, sprite.y / 32)
              // console.log('elexeley', ele.x / 32, ele.y / 32)
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
          ele.alpha = alpha
          ele.inputEnabled = inputEnabled
          ele.events.onInputDown.add(sprite => that.moveHere(sprite), that)
          if (ele.events.onInputDown._bindings.length > 1) {
            ele.events.onInputDown._bindings.shift()
          }
        }
      })
    })
  }
}

// const disableMovementToOtherPieces = (x, y) => {
//   for(var key in that.pieces) {
//     //if that piece isn't a city, don't move on top of it
//     if(that.pieces[key].key.indexOf('city') === -1) {
//       if(x === that.pieces[key].position.x && y === that.pieces[key].position.y) {

//       }
//     }
//   }
// }
