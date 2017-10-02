var waterCoords = [
    [64, 0],
    [64, 32],
    [64, 64],
    [64, 96],
    [64, 128],
    [96, 128],
    [128, 128],
    [160, 128],
    [192, 128],
    [192, 160],
    [224, 160],
    [352, 224],
    [384, 224],
    [416, 224],
    [448, 224],
    [480, 224],    
    [512, 224],
    [544, 224],
    [576, 224],
    [608, 224],
]

var treeCoords = [
    [32, 192],
    [32, 224]
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
