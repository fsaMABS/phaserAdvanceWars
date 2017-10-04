const aw2Map = require('../public/assets/js/aw2.json')

console.log('aw2map', aw2Map)
export default function createGrid(mapName) {
    const gridWidth = aw2Map.width;
    const gridHeight = aw2Map.height;
    const grid = []
    const layers = aw2Map.layers
    let finaldata = layers[0].data
    finaldata = finaldata.map((datapoint, index) => {
        return Math.max(...layers.map(layer => layer.data[index]))
    })
    // console.log('finaldata', finaldata)

    for (var i = 0; i < finaldata.length; i += gridWidth) {
        grid.push(finaldata.slice(i, i + gridWidth))
    }
    //console.log('grid', grid)
    
    return grid
}