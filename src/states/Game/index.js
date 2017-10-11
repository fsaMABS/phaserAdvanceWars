/* globals __DEV__ */
import Phaser from 'phaser'
import easystarjs from 'easystarjs'
import { loadLevel } from './initialize'
import City from '../../sprites/City'
// var easystarjs = require('easystarjs')
var easystar = new easystarjs.js()

export default class extends Phaser.State {
  init () {
    this.selectedPiece = undefined
  }

  create () {
    easystar.setAcceptableTiles([0, 2, 3, 4])
    const level = loadLevel(this)
    easystar.setGrid(level())
  }

  togglePlayer () {
    this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red'
    for (var key in this.pieces) {
      this.pieces[key].alpha = 1.0
      this.pieces[key].inputEnabled = this.pieces[key].team === this.currentPlayer
    }
    this.playerText.text = this.currentPlayer
  }

  moveHere (sprite) {
    this.selectedPiece.visible = true
    this.blocks.children.forEach(ele => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)
    if (this.selectedPiece.team === this.currentPlayer) { this.changePosition = this.game.add.tween(this.selectedPiece) }
    easystar.findPath(
      this.selectedPiece.x / 32,
      this.selectedPiece.y / 32,
      sprite.x / 32,
      sprite.y / 32,
      path => {
        this.changePosition = this.game.add.tween(this.selectedPiece)
        for (var i = 0; i < path.length; i++) {
          var currCoords = path[i]
          this.changePosition.to(
            { x: currCoords.x * 32, y: currCoords.y * 32 },
            150
          )
          // revealedFog = {x: currCoords.x*32, y: currCoords.y*32}
        }
        this.changePosition.start()
        this.changePosition.onComplete.add(function () {
          this.checkForPieceOptions()
          this.disablePieceMovement(this.selectedPiece)
        }, this)
      }
    )
    easystar.calculate()
  }

  checkForPieceOptions () {
    let defenders = []
    for (var key in this.pieces) {
      if (
        this.pieces[key] !== this.selectedPiece &&
        this.pieces[key].team !== this.selectedPiece.team &&
        this.pieces[key].key.indexOf('city') === -1
      ) {
        let diffX = Math.abs(
          this.pieces[key].position.x - this.selectedPiece.position.x
        )
        let diffY = Math.abs(
          this.pieces[key].position.y - this.selectedPiece.position.y
        )
        if (diffX + diffY <= this.selectedPiece.attackRadius * 32) {
          defenders.push(this.pieces[key])
        }
      }
    }
    if (!this.attackButton || !this.attackButton.alive) {
      if (defenders.length === 1) {
        this.attackButton = this.game.add.button(
          this.selectedPiece.x,
          this.selectedPiece.y + 99,
          'fireSprite',
          () => this.attackPiece(this.selectedPiece, defenders[0], defenders),
          this,
          2,
          1,
          0
        )
      } else if (defenders.length > 1) {
        this.selectTargets(this.selectedPiece, defenders)
      }
    }
    if (!this.waitButton || !this.waitButton.alive) {
      this.canEndTurn = false
      this.waitButton = this.game.add.button(
        this.selectedPiece.x,
        this.selectedPiece.y + 32,
        'waitSprite',
        () => this.wait(defenders), this,
        2,
        1,
        0
      )
    }

    if (!this.captButton || !this.captButton.alive) {
      for (var i in this.pieces) {
        if (this.pieces[i].key.indexOf('city') !== -1) {
          if (
            this.selectedPiece.position.x === this.pieces[i].position.x &&
            this.selectedPiece.position.y === this.pieces[i].position.y
          ) {
            this.captButton = this.game.add.button(
              this.selectedPiece.x,
              this.selectedPiece.y + 32,
              'captSprite',
              () => this.captureCity(this.pieces[i].position, i, defenders),
              this,
              2,
              1,
              0
            )
            break;
          }
        }
      }
    }
  }

  selectTargets (attacker, defenders) {
    this.targets = []
    defenders.forEach((defender, index) => {
      let target = this.game.add.image(defender.x, defender.y, 'target')
      this.targets.push(target)
      defender.inputEnabled = true
      defender.data.targetAttack = defender =>
        this.attackPiece(attacker, defender, defenders)
      defender.events.onInputDown.add(defender.data.targetAttack, this)
    })
  }

  attackPiece (attacker, defender, defenders) {
    this.disableDefenders(defenders)
    attacker.inputEnabled = false
    if (this.targets) this.targets.forEach(target => target.destroy())
    defender.HP -= attacker.AP
    if (defender.HP >= 0) {
      attacker.HP -= Math.floor(defender.AP / 2)
    }
    attacker.alpha = 0.7
    this.disablePieceOptions()
  }

  captureCity (city, index, defenders) {
    let campedCity = this.pieces[index]
    this.disableDefenders(defenders)

    if (this.selectedPiece.team !== campedCity.team) {
      // HQ Scenario:
      if (campedCity.isHQ) {
        campedCity.Cap -= this.selectedPiece.HP
        if (campedCity.Cap <= 0) {
          window.game.winner = this.selectedPiece.team
          this.gameOver = true
        }
      }
    }

    campedCity.Cap -= this.selectedPiece.HP

    // ======== CITY ISSUE ======
    // is this 'camped City' being persisted? after its been captured once, when I start to
    // capture with the other team, it says the new Cap is -10, so its not being destroyed? Not sure
    // just a heads up

    if (campedCity.Cap <= 0) {
      let newCityColorAsset =
        this.selectedPiece.team === 'red' ? 'city_red' : 'city_blue'
      var newCity = new City({
        game: this.game,
        x: campedCity.position.x,
        y: campedCity.position.y,
        asset: newCityColorAsset,
        width: 30,
        height: 40,
        Def: 3,
        Cap: 20,
        player: 1,
        id: campedCity.id,
        team: this.selectedPiece.team,
        isHQ: false
      })
      for (var key in this.pieces) {
        if (this.pieces[key].id === campedCity.id) delete this.pieces[key]
      }
      campedCity.destroy()

      this.game.world.add(newCity)
      this.pieces[index] = newCity
    }
    this.selectedPiece.alpha = 0.7
    this.disablePieceOptions()
  }

  disablePieceMovement (piece) {
    piece.inputEnabled = false
  }

  disablePieceOptions () {
    if (this.captButton) this.captButton.destroy()
    if (this.waitButton) this.waitButton.destroy()
    if (this.attackButton) this.attackButton.destroy()
    if (this.captButton) this.captButton.destroy()
    if (this.targets) this.targets.forEach(target => target.destroy())
    if (this.showingMoves) this.showingMoves = false
    this.showingBlue = false
    this.canEndTurn = true
    this.selectedPiece = undefined
  }

  disableDefenders (defenders) {
    if (defenders.length) {
      defenders.forEach(defender => {
        defender.inputEnabled = false
        if (defenders.length > 1) { defender.events.onInputDown.remove(defender.data.targetAttack, this) }
      })
    }
  }


  wait (defenders) {
    this.disableDefenders(defenders)
    this.waitButton.pendingDestroy = true
    this.selectedPiece.alpha = 0.7
    this.disablePieceOptions()
  }

  endTurn () {
    this.selectedPiece = undefined
    this.disablePieceOptions()
    // var style = { font: '18px Arial', fill: '#fff' }
    // this.turnEnded = this.game.add.text(this.game.world.centerX-32, this.game.world.centerY-32, "Turn Ended", style)
    // this.time.events.add(1000, () => {
    // this.turnEnded.destroy()
    this.togglePlayer()
    // }, this.turnEnded);
  }

  stayInPlace () {
    this.shiftKey.onDown.remove(this.stayInPlace, this)
    this.blocks.children.forEach(ele => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)
    this.checkForPieceOptions()
  }

  update () {
    this.enterKey.onDown.add(this.endTurn, this)

    if (
      !this.shiftKey.onDown._bindings ||
      (this.shiftKey.onDown._bindings && !this.shiftKey.onDown._bindings.length)
    ) {
      this.shiftKey.onDown.add(this.stayInPlace, this)
    }

    this.shiftKey._enabled = !!this.showingMoves
    this.enterKey._enabled = !!this.canEndTurn

    let redLose = true
    let blueLose = true
    // ALL PIECE UPDATES
    for (var piece in this.pieces) {
      const pc = this.pieces[piece]

      if (pc.HP <= 0) {
        pc.destroy()
        delete this.pieces[piece]
      } else {
        if (pc.children[0]) pc.children[0].destroy()
        let newHealth = this.game.add.text(60, 60, pc.HP, this.healthStyle)
        pc.addChild(newHealth)
      }
      if (pc.team === 'red') redLose = false
      if (pc.team === 'blue') blueLose = false
    }
    if (redLose) {
      window.game.winner = 'blue'
      this.gameOver = true
    }
    if (blueLose) {
      window.game.winner = 'red'
      this.gameOver = true
    }
    if (this.gameOver) this.state.start('EndGame')
  }

  render () {}
}
// let revealedFog = {}

// Helper Functions
// const isNear = (ele, sprite, dist) =>
//   Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist

//    if (__DEV__) {
// this.game.debug.spriteInfo(this.pieces, 32, 32)
// }
// this.fog.children.map((ele) => {
//   if (ele.alpha && isNear(ele, revealedFog, 10)) ele.alpha = 0
// })
// toggleKeyboardEvents(key) {
//   if (!key.onDown._bindings || (key.onDown._bindings && !key.onDown._bindings.length)) {
//     key.onDown.add(this.stayInPlace, this);
//   }
// }
