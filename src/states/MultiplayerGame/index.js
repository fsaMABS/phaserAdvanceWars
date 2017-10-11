/* globals __DEV__ */
import Phaser from 'phaser'
import easystarjs from 'easystarjs'
import {loadLevel} from './initialize'
import newGrid from '../../processMap'
import City from '../../sprites/City'
// var easystarjs = require('easystarjs')
var easystar = new easystarjs.js()

const turnobjectToArray = pieces => ({pieces: Object.keys(pieces).map(pckey => {
  const piece = pieces[pckey]
  const res = {}
  const slots = ['alpha', 'team', 'id', 'key', 'player']
  slots.forEach(x => res[x] = piece[x])
  res['x'] = piece.position.x
  res['y'] = piece.position.y
  return res
})})

let firebase
export default class extends Phaser.State {
  init () {
    firebase = this.game.firebase
    this.showingBlue = false
    this.selectedPiece = undefined
    firebase.database().ref(`lobbies/${this.game.lobby}/game`).set({currentPlayer: 'red'})
  }

  create () {
    easystar.setGrid(newGrid())
    easystar.setAcceptableTiles([0,1,2,3,4])
    loadLevel(this)
    console.log('*******this.piecesthis.pieces', this.pieces)
    firebase.database().ref(`lobbies/${this.game.lobby}/pieces`).set(turnobjectToArray(this.pieces))
  }

  togglePlayer () {
    // console.log('this.pieces', this.pieces)
    this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red'
    firebase.database().ref(`lobbies/${this.game.lobby}/game`).set({currentPlayer: this.currentPlayer})
    // ENABLE PIECES
    for (var key in this.pieces) {
      this.pieces[key].alpha = 1.0;
      this.pieces[key].inputEnabled = this.pieces[key].team == this.currentPlayer ? true : false
    }
    this.playerText.text = this.currentPlayer
  }
  sendMoveMessage (sprite) {
    if (this.showingBlue) {
      this.showingBlue = false
    }
  }

  moveHere (sprite) {
    this.selectedPiece.visible = true
    this.blocks.children.forEach((ele) => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)
    
    if (this.selectedPiece.team === this.currentPlayer) this.changePosition = this.game.add.tween(this.selectedPiece)
    easystar.findPath(this.selectedPiece.x/32, this.selectedPiece.y/32, sprite.x/32, sprite.y/32, ( path ) => {
      this.changePosition = this.game.add.tween(this.selectedPiece)          
      for (var i = 0 ; i < path.length; i++) {
        var currCoords = path[i]
        this.changePosition.to({x: currCoords.x*32, y: currCoords.y* 32}, 150) 
        // revealedFog = {x: currCoords.x*32, y: currCoords.y*32}
      }
      this.changePosition.start()
      this.changePosition.onComplete.add(function () {
        this.sendMoveMessage(this.selectedPiece);
        this.checkForPieceOptions();
        this.disablePieceMovement(this.selectedPiece);
      }, this)
    
    });
    easystar.calculate()
  }

  checkForPieceOptions() {
    let defenders = [];
    for(var key in this.pieces) {
      if(this.pieces[key] !== this.selectedPiece && this.pieces[key].team !== this.selectedPiece.team) {
        let diffX = Math.abs(this.pieces[key].position.x - this.selectedPiece.position.x)
        let diffY = Math.abs(this.pieces[key].position.y - this.selectedPiece.position.y)
        console.log('curr piece', this.selectedPiece)
        if((diffX + diffY <= (this.selectedPiece.attackRadius*32))) {
          defenders.push(this.pieces[key]);
        }
      }
    }
    if(!this.attackButton || !this.attackButton.alive) {
      if(defenders.length === 1) {
        this.attackButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + 99, 'fireSprite', 
          () => this.attackPiece(this.selectedPiece, defenders[0], defenders), this, 2, 1, 0);
      } else if(defenders.length > 1) {
        this.selectTargets(this.selectedPiece, defenders)
      }
    }
    if(!this.waitButton || !this.waitButton.alive) {
      this.waitButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + 64, 'waitSprite', this.wait, this, 2, 1, 0);
    }
    
    if (!this.captButton || !this.captButton.alive) {
      for (var i in this.pieces) {
        if (this.pieces[i].key.indexOf('city') !== -1) {
              if (this.selectedPiece.position.x === this.selectedPiece.position.x && this.selectedPiece.position.y === this.selectedPiece.position.y) {
                  this.captButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + 32, 'captSprite',
                  () => this.captureCity(this.pieces[i]), this, 2, 1, 0);
              }
        }
      }
    }
  }

  selectTargets (attacker, defenders) {
    this.targets = [];
    defenders.forEach((defender, index) => {
      let target = this.game.add.image(defender.x, defender.y, 'target')
      this.targets.push(target);
      defender.inputEnabled = true;
      defender.data.targetAttack = (defender) => this.attackPiece(attacker, defender, defenders)
      defender.events.onInputDown.add(defender.data.targetAttack, this)
    })
  }

  attackPiece (attacker, defender, defenders) {
    console.log('defenders', defenders)
    if(defenders.length > 1) {
      defenders.forEach(defender => {
        defender.inputEnabled = false
        defender.events.onInputDown.remove(defender.data.targetAttack, this);
      })
    }
    // else { defender.inputEnabled = false} ...may need this later haven't found a bug associated with it though
    attacker.inputEnabled = false;
    if(this.targets) this.targets.forEach(target => target.destroy());
    defender.HP -= attacker.AP
    if(defender.HP >= 0) {
      attacker.HP -= Math.floor(defender.AP / 2);
    }
    attacker.alpha = 0.7;
    this.disablePieceOptions();
  }

  captureCity (campedCity) {    
    this.selectedPiece

    console.log('campedCity', campedCity)
    campedCity.Cap -= this.selectedPiece.HP

   
    
    if (campedCity.Cap <= 0) {
      if (this.selectedPiece.team === 'red') {
        var newCityColorAsset = 'city_red'
      } else {
        var newCityColorAsset = 'city_blue'
      }
      console.log('campedcity in if', campedCity)
      campedCity.destroy()
      setTimeout(() => {
        console.log('campedCit after I destroy', campedCity)
      }, 5000)
      console.log('campedCit after I destroy', campedCity)
      console.log('cityasset', newCityColorAsset)
      var newCity = new City({
        game: this.game,
        x: 96,
        y: 96,
        asset: newCityColorAsset,
        width: 30,
        height: 40,
        Def: 3,
        Cap: 20,
        player: 1,
        id: 1,
        team: 'neutral'
      })
      this.game.world.add(newCity);
      
      // campedCity.asset = "city_" + this.selectedPiece.team
      // campedCity.team = this.selectedPiece.team
    }

    this.selectedPiece.alpha = 0.7;
    this.disablePieceOptions();

    // console.log(this.pieces)
  }

  disablePieceMovement (piece) {
    piece.inputEnabled = false;
  }

  disablePieceOptions () {
    if(this.captButton) this.captButton.destroy();
    if(this.waitButton) this.waitButton.destroy();
    if(this.attackButton) this.attackButton.destroy();
  }

  wait () {
    this.waitButton.pendingDestroy = true;
    this.selectedPiece.alpha = 0.7;
    this.disablePieceOptions();
  }

  endTurn () {
    this.disablePieceOptions();
    //var style = { font: '18px Arial', fill: '#fff' }
    // this.turnEnded = this.game.add.text(this.game.world.centerX-32, this.game.world.centerY-32, "Turn Ended", style)
    // this.time.events.add(1000, () => {
      // this.turnEnded.destroy()
      this.togglePlayer()
    // }, this.turnEnded);
  }

  update () {
    this.enterKey.onDown.add(this.endTurn, this)

    firebase.database().ref(`lobbies/${this.game.lobby}/pieces`).set(turnobjectToArray(this.pieces))
    //ALL PIECE UPDATES
    for (var piece in this.pieces) {
      const pc = this.pieces[piece]

      //If dead: destroy it
      if (pc.HP <= 0) {
        pc.destroy()
        delete this.pieces[piece]
      }
      //Else: Update Health by Destroying Old Health and Rendering New
      else {
        if (pc.children[0]) {
          pc.children[0].destroy()          
        }
        let newHealth = this.game.add.text(40, 40, pc.HP, this.healthStyle)
        pc.addChild(newHealth);
      }

      //If piece is disabled, make it transparent --- but this turns off when it can't move
      //  so it looks disabled when the piece can still attack or what...
    }
  }

  render () {
    // this.fog.children.map((ele) => {
    //   if (ele.alpha && isNear(ele, revealedFog, 10)) ele.alpha = 0
    // })
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}

let revealedFog = {}

const isNear = (ele, sprite, dist) => Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
