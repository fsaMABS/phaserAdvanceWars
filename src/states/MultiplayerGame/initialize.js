import Infantry from '../../sprites/Infantry'
import City from '../../sprites/City'
import SmallTank from '../../sprites/SmallTank'
import Block from '../../sprites/Block'
// import newGrid from '../../processMap'
import easystarjs from 'easystarjs'
var easystarz = new easystarjs.js()

export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
    x: (480),
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
    attackRadius: 2    
  }),
  2: new Infantry({
    game: that.game,
    x: 480,
    y: (32*15),
    asset: 'infantry_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 1,
    id: 1,
    mobility: 5,
    team: 'blue',
    attackRadius: 2    
  }),
  3: new SmallTank({
    game: that.game,
    x: 480,
    y: (32*17),
    asset: 'smallTank_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: 2,
    mobility: 7,
    team: 'blue',
    attackRadius: 2
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
    id: 3,
    mobility: 5,
    team: 'red',
    attackRadius: 2    
  }),
  5: new Infantry({
    game: that.game,
    x: 64,
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
  6: new City({
    game: that.game,
    x: (32),
    y: (32*19),
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 1,
    team: 'neutral'
  })
})

export const loadLevel = (that) => {
  that.background = that.game.add.sprite(0, 0, 'aw1Map')
  that.scale.pageAlignHorizontally = true
  that.scale.pageAlignVertically = true
  that.enterKey = that.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  that.attackButton = undefined
  that.waitButton = undefined
  that.healthStyle = { font: "18px Arial", fill: "black" }

  var style = { font: '20px Arial', fill: '#fff' }
  that.game.add.text(410, 20, 'Player:', style)
  that.currentPlayer = 'red'
  that.playerText = that.game.add.text(480, 20, that.currentPlayer, style)
  that.blocks = that.add.group()
  that.fog = that.add.group()
  const isNear = (ele, sprite, dist) => Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
  for (var i = 0; i < 3000; i = i + 32) {
    for (var j = 0; j < 3000; j = j + 32) {
      var block = new Block(i, j, 'blueSquare', 32, 32, 'land')
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
    added.events.onInputDown.add(showMoves(that), this)
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
  that.selectedPiece = sprite

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
