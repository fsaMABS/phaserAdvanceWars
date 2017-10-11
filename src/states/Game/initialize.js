import Infantry from '../../sprites/Infantry'
import City from '../../sprites/City'
import SmallTank from '../../sprites/SmallTank'
import {checkType} from '../../levels/level1'
import Block from '../../sprites/Block'
import newGrid from '../../processMap'
import easystarjs from 'easystarjs'
var easystarz = new easystarjs.js()

export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
    x: (64),
    y: (32*16),
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 1,
    mobility: 5,
    team: 'blue',
    attackRadius: 1,
    troopType: 'infantry'
  }),
  2: new Infantry({
    game: that.game,
    x: (32*0),
    y: (32*15),
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 2,
    mobility: 5,
    team: 'blue',
    attackRadius: 1,
    troopType: 'infantry'
  }),
  3: new SmallTank({
    game: that.game,
    x: (32*0),
    y: (32*17),
    asset: 'smallTank_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: 3,
    mobility: 7,
    team: 'blue',
    attackRadius: 1,
    troopType: 'smallTank'
  }),
  4: new SmallTank({
    game: that.game,
    x: 128,
    y: 160,
    asset: 'smallTank_red',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: 2,
    mobility: 7,
    team: 'red',
    attackRadius: 1,
    troopType: 'smallTank'
  }),
  5: new Infantry({
    game: that.game,
    x: (32*25),
    y: 64,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 4,
    mobility: 5,
    team: 'red',
    attackRadius: 2    
  }),
  6: new Infantry({
    game: that.game,
    x: (32*24),
    y: (64),
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 5,
    mobility: 5,
    team: 'red',
    attackRadius: 2    
  }),
  7: new City({
    game: that.game,
    x: (32),
    y: (32*18),
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 6,
    team: 'neutral',
    isHQ: false
  }),
  7: new SmallTank({
    game: that.game,
    x: (32*1),
    y: (32*17),
    asset: 'smallTank_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: 7,
    mobility: 7,
    team: 'blue',
    attackRadius: 2,
    troopType: 'smallTank'
  }),
  8: new Infantry({
    game: that.game,
    x: (32*2),
    y: (32*15),
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 8,
    mobility: 5,
    team: 'blue',
    attackRadius: 2,
    troopType: 'infantry'  
  }),
  9: new City({
    game: that.game,
    x: (32*5),
    y: (32*14),
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 9,
    team: 'neutral',
    isHQ: false
  }),
})


export const loadLevel = (that) => {
  that.background = that.game.add.sprite(0, 0, 'aw1Map')
  that.scale.pageAlignHorizontally = true;
  that.scale.pageAlignVertically = true;
  that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);  
  that.shiftKey = that.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  that.canEndTurn = true;
  that.attackButton = undefined;
  that.waitButton = undefined;
  that.healthStyle = { font: "18px Arial", fill: "black" };
  that.gameOver = false;  
  that.winner = '';

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 'red'
  that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
  that.blocks = that.add.group()
  that.fog = that.add.group()
  const isNear = (ele, sprite, dist) => Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
  for (var i = 0; i <= 928; i = i + 32) {
    for (var j = 0; j <= 768; j = j + 32) {
      var type = checkType(i, j)
      var block = new Block(i, j, 'blueSquare', 32, 32, type)
      block.alpha = 0.0
      that.blocks.add(block)
      // that.fog.add(new Block(i, j, 'fogSquare', 32, 32, type))
    }
  }

  that.pieces = startingPieces(that)
  const revealedFog = []

  for (var key in that.pieces) {
    let current = that.pieces[key]
    let added = that.game.world.add(current)
    added.inputEnabled = true
    if(added.key.indexOf('city') === -1) added.events.onInputDown.add(showMoves(that), this)
    that.pieces[key] = added
    revealedFog.push({x: current.position.x, y: current.position.y})

    let pieceHealth = that.game.add.text(20, 20, that.pieces[key].HP, that.healthStyle);
    that.pieces[key].addChild(pieceHealth)
  }
  that.fog.children.map(ele => {
    revealedFog.forEach(fog => {
      if (ele.alpha && isNear(ele, fog, 10)) ele.alpha = 0
    })
  })
}

const showMoves = that => (sprite, event) => {
  if(!that.selectedPiece) that.selectedPiece = sprite
  if (that.currentPlayer == that.selectedPiece.team) {
    that.showingMoves = that.showingMoves === true ? false : true
    that.showingBlue = !that.showingBlue
    var alpha = that.showingBlue ? 0.5 : 0
    var childrenPromises = that.blocks.children.map((ele) => {
      if ((Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y)) < (32 * sprite.mobility)) {
        if (ele.type === 'land') {
          easystarz.setGrid(newGrid())
          if (that.selectedPiece.troopType == 'smallTank') {
            easystarz.setAcceptableTiles([0,2]);            
          } else if (that.selectedPiece.troopType == 'ship'){
            easystarz.setAcceptableTiles([1]);            
          } else {
            easystarz.setAcceptableTiles([0,2,3,4]);                        
          }
          return new Promise((resolve, reject) => {
            console.log('sprite coords', sprite.x/32, sprite.y/32)
            console.log('elexeley', ele.x/32, ele.y/32)
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
    }, that).filter(x => !!x)

    Promise.all(childrenPromises).then(elements => {
      let inputEnabled = that.showingBlue ? true : false
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