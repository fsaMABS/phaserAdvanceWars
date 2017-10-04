var waterCoords = [

]

var treeCoords = [

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
