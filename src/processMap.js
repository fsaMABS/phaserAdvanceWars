const aw2Map = require('../public/assets/js/aw2.json')

export default function createGrid(boolean) {
    const gridWidth = aw2Map.width;
    const gridHeight = aw2Map.height;
    const grid = []
    const layers = aw2Map.layers
    let finaldata = layers[0].data
    finaldata = finaldata.map((datapoint, index) => {
        return Math.max(...layers.map(layer => layer.data[index]))
    })
    for (var i = 0; i < finaldata.length; i += gridWidth) {
        grid.push(finaldata.slice(i, i + gridWidth))
    }
    return grid
}