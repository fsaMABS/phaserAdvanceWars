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

const createGrid = (that) => {
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
}

const createPieces = (that) => {
  for (var key in that.pieces) {
    let current = that.pieces[key]
    let added = that.game.world.add(current)
    added.inputEnabled = true
    if (added.key.indexOf('city') === -1) { added.events.onInputDown.add(showMoves(that), this) }
    if (added.isFactory) { added.events.onInputDown.add(makeTroops(that), this) }
    that.pieces[key] = added

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
  that.redTeam = {team: 'red', money: 10000}
  that.blueTeam = {team: 'blue', money: 10000}
  that.currentPlayer = that.blueTeam;
  that.winner = ''
  that.explosions = game.add.group();
  that.explosions.createMultiple(400, 'explode');
  that.explosions.forEach(setupPiece, this);
  that.textStyle = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', that.textStyle)
  that.playerText = that.game.add.text(480, 20, that.currentPlayer.team, that.textStyle)
  that.moneyText = that.game.add.text(20, 20, '$' + that.currentPlayer.money, that.textStyle)
  that.blocks = that.add.group()
  that.fog = that.add.group()
  that.pieces = startingPieces(that)

  const isNear = (ele, sprite, dist) => {
    Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
  }
  createGrid(that)
  createPieces(that);
  const revealedFog = []
  that.fog.children.map(ele => {
    revealedFog.forEach(fog => {
      if (ele.alpha && isNear(ele, fog, 10)) ele.alpha = 0
    })
  })
  return newGrid
}

const addTroopButtons = []

const somethingIsThere = (that, sprite) => {
  let result = false;
  for (var key in that.pieces) {
    var currPieceX = that.pieces[key].position.x
    var factoryPositionX = sprite.position.x
    var currPieceY = that.pieces[key].position.y
    var factoryPositionY = sprite.position.y + 32
    if ((currPieceX === factoryPositionX) && (currPieceY === factoryPositionY)) {
      result = true;
    }
  }
  return result;
}

const addTroopToBoard = (that, sprite, pieceType, value) => {
  that.currentPlayer.money -= value;
  let newPiece;
  let count = Object.keys(that.pieces).length;
  count = count + 1
  switch(pieceType) {
    case 'infantry':
      newPiece = new Infantry({
        game: that.game,
        x: sprite.x,
        y: sprite.y + 32,
        asset: 'infantry_' + that.currentPlayer.team,
        width: 32,
        height: 32,
        HP: 10, 
        AP: 4,
        player: 2,
        id: count,
        mobility: 5,
        team: that.currentPlayer.team,
        attackRadius: 1,
        troopType: 'infantry'
      })
      break;
    case 'smallTank':
      newPiece = new SmallTank({
        game: that.game,
        x: sprite.x,
        y: sprite.y + 32,
        asset: 'smallTank_' + that.currentPlayer.team,
        width: 32,
        height: 32,
        HP: 20,
        AP: 8,
        player: 2,
        id: count,
        mobility: 7,
        team: that.currentPlayer.team,
        attackRadius: 1,
        troopType: 'smallTank',
        squareType: 'land'
      })
      break;
    case 'longRange': 
      newPiece = new LongRange({
        game: that.game,
        x: sprite.x,
        y: sprite.y + 32,
        asset: 'longRange_' + that.currentPlayer.team,
        width: 32,
        height: 32,
        HP: 10,
        AP: 15,
        player: 1,
        id: count,
        mobility: 5,
        team: that.currentPlayer.team,
        attackRadius: 4,
        troopType: 'longRange',
        squareType: 'land'
      })
      break;
    }
  addTroopButtons.forEach(button => button.destroy());
  let newTroop = that.game.world.add(newPiece)
  newTroop.alpha = 0.7
  that.pieces[newTroop.id] = newTroop
  newTroop.events.onInputDown.add(showMoves(that), this) 
} 

const troopChoiceButton = (that, sprite, pieceType, value, offset) => {
  const button = that.game.add.button(sprite.x + 35, sprite.y + (32*offset) + 35, 'add_' + pieceType + '_' + that.currentPlayer.team,
    () => addTroopToBoard(that, sprite, pieceType, value), this, 2, 1, 0)
  const text = that.game.add.text(sprite.x + 70, sprite.y + (32*offset) + 40, '$' + value, {font: '18px Arial', fill: 'black' })
  addTroopButtons.push(button, text)
  button.events.onInputOver.add(() => button.tint = 0xd9cece, this)
  button.events.onInputOut.add(() => button.tint = 0xfffbfb, this)
}

const makeTroops = that => (sprite, event) => {
  const budget = that.currentPlayer.money
  if (that.currentPlayer.team === sprite.team && budget >= 1000) {
    let somethingThere = somethingIsThere(that, sprite)
    if (!somethingThere) {
      if(budget >= 1000) {
        troopChoiceButton(that, sprite, 'infantry', 1000, 0)
      } 
      if(budget >= 4000) {
        troopChoiceButton(that, sprite, 'smallTank', 4000, 1)
      }
      if(budget >= 6000) {
        troopChoiceButton(that, sprite, 'longRange', 6000, 2)
      }
    }
  }
}

const showMoves = that => (sprite, event) => {

    
// if (!that.selectedPiece) {
  // that.selectedPiece = sprite
// } 

console.log('spriteteam', sprite.team)
console.log('currentplayer team', that.currentPlayer.team)
console.log('currentSuerteam', that.game.currentUser.role)
if ((that.currentPlayer.team === sprite.team) && (that.game.currentUser.role === sprite.team)) {
  that.selectedPiece = sprite  
  that.game.firebase.database().ref(`lobbies/${that.game.lobby}/game`).set({currentPieceId: sprite.id})
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