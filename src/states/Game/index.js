/* globals __DEV__ */
import Phaser from 'phaser'
import easystarjs from 'easystarjs'
import {loadLevel} from './initialize'
import newGrid from '../../processMap'
// var easystarjs = require('easystarjs')
var easystar = new easystarjs.js()

export default class extends Phaser.State {
  init () {
    this.showingBlue = false
    this.selectedPiece = undefined
  }

  create () {
    easystar.setGrid(newGrid());
    easystar.setAcceptableTiles([2]);
    loadLevel(this)
  }

  togglePlayer () {
    // console.log('this.pieces', this.pieces)
    this.currentPlayer = this.currentPlayer === 'red' ? 'blue' : 'red'
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
        revealedFog = {x: currCoords.x*32, y: currCoords.y*32}
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
        this.attackButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y+99, 'fireSprite', 
          () => this.attackPiece(this.selectedPiece, defenders[0], defenders), this, 2, 1, 0);
      } else if(defenders.length > 1) {
        this.selectTargets(this.selectedPiece, defenders)
      }
    }
    if(!this.waitButton || !this.waitButton.alive) {
      this.waitButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y+64, 'waitSprite', this.wait, this, 2, 1, 0);
    }
    
    if (!this.captButton || !this.captButton.alive) {
      this.captButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + 64, 'captSprite',
        () => this.captureCity(city), this, 2, 1, 0);
    }
  
}

  selectTargets(attacker, defenders) {
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
    campedCity.Cap -= this.selectedPiece.HP

    this.selectedPiece.alpha = 0.7;
    this.disablePieceOptions();
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
    // for(var i in this.pieces) {
    //   console.log(this.pieces[i])
    //   if(this.pieces[i].key.indexOf('city') !== -1) {
    //     let current_city = this.pieces[i];
    //     for(var j in this.pieces) {
    //       if(this.pieces[j].key.indexOf('infantry') !== -1) {
    //         if(this.pieces[j].position.x === current_city.position.x && this.pieces[j].position.y === current_city.position.y) {
    //           // console.log('here')
    //         }
    //       }
    //     }
    //   }
    // }
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
        pc.children[0].destroy()
        let newHealth = this.game.add.text(40, 40, pc.HP, this.healthStyle)
        pc.addChild(newHealth);
      }

      //If piece is disabled, make it transparent --- but this turns off when it can't move
      //  so it looks disabled when the piece can still attack or what...
    }
  }

  render () {
    this.fog.children.map((ele) => {
      if (ele.alpha && isNear(ele, revealedFog, 10)) ele.alpha = 0
    })
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.pieces, 32, 32)
    }
  }
}

let revealedFog = {}

const isNear = (ele, sprite, dist) => Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist
