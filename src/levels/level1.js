var waterCoords = [
    [64, 0],
    [64, 32],
    [64, 64],
    [64, 96],
    [64, 128],
    [96, 128],
    [128, 128]
]

var treeCoords = [
    []
]

var mountainCoords = [
    []
]
export const checkType = (x, y) => {
    var type = 'land'
    waterCoords.forEach((ele) => {
      var [eleX, eleY ] = ele
      if (x === eleX && y === eleY) {
        type = 'water'
      }
    })
    treeCoords.forEach((ele) => {
        var [eleX, eleY ] = ele
        if (x === eleX && y === eleY) {
          type = 'tree'
        }
      })
    mountainCoords.forEach((ele) => {
    var [eleX, eleY ] = ele
    if (x === eleX && y === eleY) {
        type = 'mountain'
    }
    })
    return type;
}
