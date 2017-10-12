import Infantry from '../../sprites/Infantry'
import City from '../../sprites/City'
import SmallTank from '../../sprites/SmallTank'
import Factory from '../../sprites/Factory'
import Boat from '../../sprites/Boat'
import LongRange from '../../sprites/LongRange'
import processMapcreateGrid from '../processMap'
const mapdata = require('./map.json')

export default function createGrid () {
  return processMapcreateGrid(mapdata)
}
export const startingPieces = that => ({
  // NEED TO ADD TYPES TO THE NAME AT SOME POINT
  1: new Infantry({
    game: that.game,
    x: 64,
    y: 32 * 16,
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
    troopType: 'infantry',
    squareType: 'land'
  }),
  2: new Infantry({
    game: that.game,
    x: 32 * 0,
    y: 32 * 15,
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
    troopType: 'infantry',
    squareType: 'land'
  }),
  3: new SmallTank({
    game: that.game,
    x: 32 * 0,
    y: 32 * 17,
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
    troopType: 'smallTank',
    squareType: 'land'
  }),
  4: new SmallTank({
    game: that.game,
    x: 32 * 23,
    y: 32 * 4,
    asset: 'smallTank_red',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 2,
    id: 4,
    mobility: 7,
    team: 'red',
    attackRadius: 1,
    troopType: 'smallTank',
    squareType: 'land'
  }),
  5: new Infantry({
    game: that.game,
    x: 32 * 22,
    y: 32 * 5,
    asset: 'infantry_red',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 5,
    mobility: 5,
    team: 'red',
    attackRadius: 2,
    troopType: 'infantry',
    squareType: 'land'
  }),
  6: new Infantry({
    game: that.game,
    x: 32 * 24,
    y: 32 * 4,
    asset: 'infantry_red',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 6,
    mobility: 5,
    team: 'red',
    attackRadius: 2,
    troopType: 'infantry',
    squareType: 'land'
  }),
  7: new SmallTank({
    game: that.game,
    x: 32 * 4,
    y: 32 * 17,
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
    troopType: 'smallTank',
    squareType: 'land'
  }),
  8: new Infantry({
    game: that.game,
    x: 32 * 2,
    y: 32 * 15,
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
    troopType: 'infantry',
    squareType: 'land'
  }),
  9: new Factory({
    game: that.game,
    x: 32 * 5,
    y: 32 * 14,
    asset: 'city_blue',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 9,
    team: 'blue',
    isHQ: false,
    troopType: 'city',
    isFactory: true
  }),
  10: new City({
    game: that.game,
    x: 32,
    y: 32 * 18,
    asset: 'city_blue',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 10,
    team: 'blue',
    isHQ: false,
    troopType: 'city'
  }),
  11: new Factory({
    game: that.game,
    x: 32*23,
    y: 32 * 6,
    asset: 'city_red',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 11,
    team: 'red',
    isHQ: false,
    isFactory: true
  }),
  12: new City({
    game: that.game,
    x: 32*23,
    y: 32 * 20,
    asset: 'city_red',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 10,
    team: 'red',
    isHQ: false,
    troopType: 'city'
  }),
  13: new City({
    game: that.game,
    x: 32*16,
    y: 32*8,
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 10,
    team: 'neutral',
    isHQ: false,
    troopType: 'city'
  }),
  14: new City({
    game: that.game,
    x: 32*15,
    y: 32*9,
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 11,
    team: 'neutral',
    isHQ: false,
<<<<<<< HEAD
    isFactory: true
  }),
  12: new Boat({
    game: that.game,
    x: 32 * 2,
    y: 32 * 13,
    asset: 'boat_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 1,
    id: 12,
    mobility: 5,
    team: 'blue',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
  }),
  13: new Boat({
    game: that.game,
    x: 32 * 8,
    y: 32 * 7,
    asset: 'boat_red',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 1,
    id: 13,
    mobility: 5,
    team: 'red',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
  }),
  14: new Boat({
    game: that.game,
    x: 32 * 19,
    y: 32 * 13,
    asset: 'boat_red',
=======
    troopType: 'city'
  }),
  15: new Infantry({
    game: that.game,
    x: 32 * 23,
    y: 32 * 5,
    asset: 'infantry_red',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 6,
    mobility: 5,
    team: 'red',
    attackRadius: 2,
    troopType: 'infantry',
    squareType: 'land'
  }),
  16: new SmallTank({
    game: that.game,
    x: 32 * 22,
    y: 32 * 6,
    asset: 'smallTank_red',
>>>>>>> master
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
<<<<<<< HEAD
    player: 1,
    id: 14,
    mobility: 5,
    team: 'red',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
  }),
  15: new Boat({
    game: that.game,
    x: 32 * 8,
    y: 32 * 18,
    asset: 'boat_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 1,
    id: 15,
    mobility: 5,
    team: 'blue',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
  }),
  16: new Boat({
    game: that.game,
    x: 32 * 12,
    y: 32 * 1,
    asset: 'boat_red',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 1,
    id: 16,
    mobility: 5,
    team: 'red',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
  }),
  17: new Boat({
    game: that.game,
    x: 32 * 12,
    y: 32 * 12,
    asset: 'boat_blue',
    width: 32,
    height: 32,
    HP: 20,
    AP: 8,
    player: 1,
    id: 17,
    mobility: 5,
    team: 'blue',
    attackRadius: 6,
    troopType: 'boat',
    squareType: 'water'
=======
    player: 2,
    id: 4,
    mobility: 7,
    team: 'red',
    attackRadius: 1,
    troopType: 'smallTank',
    squareType: 'land'
  }),

   17: new LongRange({
    game: that.game,
    x: 32 * 22,
    y: 32 * 7,
    asset: 'longRange_red',
    width: 32,
    height: 32,
    HP: 10,
    AP: 15,
    player: 1,
    id: 8,
    mobility: 5,
    team: 'red',
    attackRadius: 4,
    troopType: 'longRange',
    squareType: 'land'
  }),

   18: new LongRange({
    game: that.game,
    x: 32 * 4,
    y: 32 * 15,
    asset: 'longRange_blue',
    width: 32,
    height: 32,
    HP: 10,
    AP: 15,
    player: 1,
    id: 8,
    mobility: 5,
    team: 'blue',
    attackRadius: 4,
    troopType: 'longRange',
    squareType: 'land'
>>>>>>> master
  })

})
