/* globals __DEV__ */
import Phaser from 'phaser'
// import easystarjs from 'easystarjs'
import {loadLevel} from './initialize'
import newGrid from '../../maps/aw2'
import City from '../../sprites/City'
var easystarjs = require('easystarjs')
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
    firebase.database().ref(`lobbies/${this.game.lobby}/game`).set({currentPlayer: 'blue'})
  }

  create () {
    easystar.setGrid(newGrid())
    easystar.setAcceptableTiles([0,1,2,3,4])    
    const level = loadLevel(this)

    this.game.firebase.database().ref(`lobbies/${this.game.lobby}/game`).set({currentPiece: 'null'})

    firebase.database().ref(`lobbies/${this.game.lobby}/game/currentPiece`).on('value', (snapshot) => {
      console.log('snapshotval, ', snapshot.val())
      this.selectedPiece = this.pieces[snapshot.val().id]
    })
      
    firebase.database().ref(`lobbies/${this.game.lobby}/pieces/pieces`).on('child_changed', (snapshot) => {
      console.log('moved: ', snapshot)
      this.selectedPiece = this.pieces[snapshot.val().id]
      easystar.findPath(this.selectedPiece.x/32, this.selectedPiece.y/32, snapshot.val().x/32, snapshot.val().y/32, ( path ) => {
        this.changePosition = this.game.add.tween(this.selectedPiece) 
        for (var i = 0 ; i < path.length; i++) {
          var currCoords = path[i]
          this.changePosition.to({x: currCoords.x*32, y: currCoords.y* 32}, 150) 
          // revealedFog = {x: currCoords.x*32, y: currCoords.y*32}
        }
        this.changePosition.start()
        this.changePosition.onComplete.add(function () {
          this.sendMoveMessage(this.selectedPiece);
          if (true) {
            firebase.database().ref(`lobbies/${this.game.lobby}/pieces`).set(turnobjectToArray(this.pieces))
          }
        }, this) 
      });
      easystar.calculate()
    })
    this.enterKey.onDown.add(this.endTurn, this)

    firebase.database().ref(`lobbies/${this.game.lobby}/pieces`).set(turnobjectToArray(this.pieces))
    
    firebase.database().ref(`lobbies/${this.game.lobby}/game`).on('value', (snapshot) => {
      if(snapshot.val() !== null ) {
        console.log('snapshot val', snapshot.val())
        if (snapshot.val().currentPlayer == 'blue') {
          console.log('setting current player to blue')
          this.currentPlayer = this.blueTeam
          this.playerText.text = 'blue'         
        } else if (snapshot.val().currentPlayer == 'red'){
          console.log('setting current player to red')          
          this.currentPlayer = this.redTeam
          this.playerText.text = 'red'         
        }
      }
    })
  }

  togglePlayer () {
    this.currentPlayer = this.currentPlayer.team === 'red' ? this.blueTeam : this.redTeam
    firebase.database().ref(`lobbies/${this.game.lobby}/game`).set({currentPlayer: this.currentPlayer.team})
    for (var key in this.pieces) {
    //   this.pieces[key].alpha = 1.0;
      // if (this.pieces[key].team === this.currentPlayer.team) {
      this.pieces[key].inputEnabled = true;  
    }
      // this.pieces[key].inputEnabled = ((this.pieces[key].team == this.currentPlayer.team) && (this.pieces[key].team === this.game.currentUser.role)) ? true : false
    // }
  }

  sendMoveMessage (sprite) {
    if (this.showingBlue) {
      this.showingBlue = false
    }
  }

  moveHere (sprite) {
    this.selectedPiece.visible = true
    this.blocks.children.forEach(ele => {
      ele.alpha = 0
      ele.inputEnabled = false
    }, this)

    if (this.selectedPiece.team === this.currentPlayer.team) { this.changePosition = this.game.add.tween(this.selectedPiece) }
    easystar.findPath(this.selectedPiece.x / 32, this.selectedPiece.y / 32, sprite.x / 32, sprite.y / 32,
      path => this.moveAndShowOptions(path)
    )
    easystar.calculate()
  }

  moveAndShowOptions(path) {
    this.changePosition = this.game.add.tween(this.selectedPiece)
    for (var i = 0; i < path.length; i++) {
      var currCoords = path[i]
      this.changePosition.to({ x: currCoords.x * 32, y: currCoords.y * 32 }, 150)
    }
    this.changePosition.start()
    this.changePosition.onComplete.add(function () {
      let firebasePiece = this.toFirebasePiece(this.selectedPiece);
      firebase.database().ref(`lobbies/${this.game.lobby}/pieces/${this.selectedPiece.id}`).set(firebasePiece)                
      this.checkForPieceOptions()
      this.disablePieceMovement(this.selectedPiece)
    }, this)
  }

  // CHECK FOR ACTION OPTIONS
  checkForPieceOptions () {
    let defenders = this.checkForDefenders();
    if (!this.waitButton || !this.waitButton.alive) this.showWaitOption(defenders)
    if (!this.attackButton || !this.attackButton.alive) this.showAttackOption(defenders)
    if (!this.captButton || !this.captButton.alive) this.showCaptOption(defenders)
  }


  // ACTION OPTIONS
  showWaitOption(defenders) {
    this.canEndTurn = false
    this.waitButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + (32*1) + 35, 'waitSprite',
      () => this.wait(defenders), this, 2, 1, 0)
  }
  showAttackOption(defenders) {
    if (defenders.length === 1) {
      this.attackButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + (32*0) + 35, 'fireSprite', 
        () => this.attackPiece(this.selectedPiece, defenders[0], defenders), this, 2, 1, 0)
    } else if (defenders.length > 1) {
      this.selectTargets(this.selectedPiece, defenders)
    }
  }
  showCaptOption(defenders) {
    for (var i in this.pieces) {
      if (this.pieces[i].key.indexOf('city') !== -1) {
        if (
          this.selectedPiece.position.x === this.pieces[i].position.x &&
          this.selectedPiece.position.y === this.pieces[i].position.y
        ) {
          this.captButton = this.game.add.button(this.selectedPiece.x, this.selectedPiece.y + (32*2) + 35, 'captSprite',
            () => this.captureCity(this.pieces[i].position, i, defenders), this, 2, 1, 0)
          break;
        }
      }
    }
  }

  checkForDefenders() {
    let defenders = [];
    for (var key in this.pieces) {
      if (
        this.pieces[key] !== this.selectedPiece &&
        this.pieces[key].team !== this.selectedPiece.team &&
        this.pieces[key].key.indexOf('city') === -1
      ) {
        let diffX = Math.abs(this.pieces[key].position.x - this.selectedPiece.position.x)
        let diffY = Math.abs(this.pieces[key].position.y - this.selectedPiece.position.y)
        if (diffX + diffY <= this.selectedPiece.attackRadius * 32) {
          defenders.push(this.pieces[key])
        }
      }
    }
    return defenders;
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
    this.disableDefenders(defenders)
    attacker.inputEnabled = false
    if (this.targets) this.targets.forEach(target => target.destroy())
    defender.HP -= attacker.AP
    this.add.tween(defender).to( { alpha: 0}, 80, Phaser.Easing.Linear.None, true, 0, 5, true);

    let diffX = Math.abs(defender.position.x - attacker.position.x)
    let diffY = Math.abs(defender.position.y - attacker.position.y)
    let canAttackBack = ((diffX + diffY) <= defender.attackRadius * 32) ? true : false;

    if (defender.HP >= 0 && canAttackBack) {
      let defenderAttack = Math.floor(defender.AP / 2)
      attacker.HP -= defenderAttack
      this.add.tween(attacker).to( { alpha: 0, tint: 0xffffff}, 80, Phaser.Easing.Linear.None, true, 0, 3, true);
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
        isHQ: false,
        troopType: 'city'
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
    if (this.targets) this.targets.forEach(target => target.destroy())
    if (this.showingMoves) this.showingMoves = false
    this.showingBlue = false
    this.canEndTurn = true
    // this.selectedPiece = undefined
  }

  disableDefenders (defenders) {
    if (defenders.length) {
      defenders.forEach(defender => {
        defender.inputEnabled = false
        if (defenders.length > 1) { defender.events.onInputDown.remove(defender.data.targetAttack, this) }
      })
    }
  }

  toFirebasePiece(sprite) {
    return {
      alpha: 1,
      id: sprite.id,
      key: sprite.key,
      player: sprite.player,
      team: sprite.team,
      x: sprite.position.x,
      y: sprite.position.y
    }
  }

  wait (defenders) {
    this.disableDefenders(defenders)
    this.waitButton.pendingDestroy = true
    // this.selectedPiece.alpha = 0.7
    this.disablePieceOptions()
  }

  endTurn () {
    console.log('registering end turn ')
    console.log(this.game.currentUser.role, this.currentPlayer.team)
    if (this.currentPlayer.team == this.game.currentUser.role) {
      console.log('it shoudl turn')
      this.selectedPiece = undefined
      this.disablePieceOptions()
      var style = { font: '18px Arial', fill: '#fff' }
      // this.turnEnded = this.game.add.text(this.game.world.centerX-32, this.game.world.centerY-32, "Turn Ended", style)
      // this.time.events.add(1000, () => {
      //     this.turnEnded.destroy()
          this.togglePlayer()
      // }, this.turnEnded);
  
      let currentPlayer = this.currentPlayer.team
      let pieces = Object.values(this.pieces)
  
      let infantry_men = pieces.filter(function (piece) {
          return piece.troopType === 'infantry'
      })
  
      let cities = pieces.filter((piece) => {
         return piece.troopType === 'city'
      })
  
      //adding money per each city
      cities.forEach((city) => {
        if(city.team == 'red' && currentPlayer == 'red') {
          let moneyStyle = { font: '24px Arial', fill: '#498304' }
          let cashMoney = this.game.add.text(city.position.x+8, city.position.y - 35, '$', moneyStyle)
          this.time.events.add(1000, () => {
            this.add.tween(cashMoney).to( { tint: 'white'}, 100, Phaser.Easing.Linear.None, true, 0, 5, true);
            cashMoney.destroy();
            this.redTeam.money += 1000
          });
        }
        if(city.team == 'blue' && currentPlayer == 'blue') this.blueTeam.money += 1000
  
        infantry_men.forEach(function (infantry) {
          if (((city.position.x === infantry.position.x) && (city.position.y === infantry.position.y)) && (city.team === infantry.team)) {
            if(currentPlayer.team == infantry.team && infantry.HP < 10) {
              let newHealth = infantry.HP + 2;
              if(newHealth >= 10) newHealth = 10;
              infantry.HP = newHealth;
            }
            // currentPlayer.team !== infantry.team && infantry.HP <= 10 ? infantry.HP += 2 : console.log('do nothing')
          }
        })
      })
    }
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
    if (this.selectedPiece) {
      console.log('thissslectec piece', this.selectedPiece.position.x, this.selectedPiece.position.y, this.selectedPiece.id)      
    }
    this.moneyText.destroy();
    this.moneyText = this.game.add.text(20, 20, '$' + this.currentPlayer.money, this.textStyle)    

    if (!this.shiftKey.onDown._bindings || (this.shiftKey.onDown._bindings && !this.shiftKey.onDown._bindings.length)) {
      this.shiftKey.onDown.add(this.stayInPlace, this)
    }

    this.shiftKey._enabled = !!this.showingMoves
    this.enterKey._enabled = !!this.canEndTurn

    let redLose = true
    let blueLose = true
    for (var piece in this.pieces) {
      const pc = this.pieces[piece]

      //if piece is dead
      if (pc.HP <= 0) {
        pc.destroy()
        let explosion = this.explosions.getFirstExists(false);
        explosion.reset(this.pieces[piece].position.x, this.pieces[piece].position.y);
        explosion.play('explode', 400, false, true);
        delete this.pieces[piece]
      } 

      //update health
      else {
        if (pc.children[1]) pc.children[1].destroy()
        let newHealth = this.game.add.text(31, 31, pc.HP, this.healthStyle)
        newHealth.anchor.set(0)
        if(!pc.children[0] && pc.key.indexOf('city') === -1) {
          let healthShape = this.game.add.graphics(30, 30);
          healthShape.beginFill(0xffffff, 1);
          healthShape.drawRoundedRect(0,0,23,23,5)
          this.pieces[piece].addChild(healthShape)
        }
        pc.addChild(newHealth)
      }

      if (pc.team === 'red') redLose = false
      if (pc.team === 'blue') blueLose = false
    }

    //check if team has lost 
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

  render () {
  }
}

let revealedFog = {}

const isNear = (ele, sprite, dist) => Math.abs(ele.x - sprite.x) + Math.abs(ele.y - sprite.y) < 32 * dist


//  was in update():   
// firebase.database().ref(`lobbies/${this.game.lobby}/game`).on('value', (snapshot) => {
    //   if(snapshot.val() === null ) return {}
    //   this.currentPlayer.team = snapshot.val().currentPlayer
    //   this.playerText.text = this.currentPlayer.team      
    // })
