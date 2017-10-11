import Infantry from '../../sprites/Infantry'
import City from '../../sprites/City'
import SmallTank from '../../sprites/SmallTank'
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
    troopType: 'infantry'
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
    troopType: 'infantry'
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
    troopType: 'smallTank'
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
    troopType: 'smallTank'
  }),
  5: new Infantry({
    game: that.game,
    x: 32 * 25,
    y: 32 * 4,
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
  6: new Infantry({
    game: that.game,
    x: 32 * 24,
    y: 32 * 4,
    asset: 'infantry',
    width: 32,
    height: 32,
    HP: 10,
    AP: 5,
    player: 2,
    id: 6,
    mobility: 5,
    team: 'red',
    attackRadius: 2
  }),
  7: new SmallTank({
    game: that.game,
    x: 32 * 1,
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
    troopType: 'smallTank'
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
    troopType: 'infantry'
  }),
  9: new City({
    game: that.game,
    x: 32 * 5,
    y: 32 * 14,
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
  10: new City({
    game: that.game,
    x: 32,
    y: 32 * 18,
    asset: 'city_grey',
    width: 30,
    height: 40,
    Def: 3,
    Cap: 20,
    player: 1,
    id: 10,
    team: 'neutral',
    isHQ: false
  })
})
