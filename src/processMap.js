const aw2Map = require('../public/assets/js/aw2JSON.json')

export default function createGrid(boolean) {
    const gridWidth = aw2Map.width;
    const gridHeight = aw2Map.height;
    const grid = []
    const layers = aw2Map.layers

    const firstLayer = layers[0].data;
    const secondLayer = layers[1].data;
    const thirdLayer = layers[2].data;
    const fourthLayer = layers[3].data;    
    const fifthLayer = layers[4].data;   
    
    const finaldata = []

    for (var i = 0; i < (30*25); i++) {
        finaldata.push(0)
    }

    for (var i = 0; i < secondLayer.length; i++) {
        var ele = secondLayer[i]
        if (ele !== 0) {
            finaldata[i] = 1;
        }
    }
    for (var i = 0; i < thirdLayer.length; i++) {
        var ele = thirdLayer[i]
        if (ele !== 0) {
            finaldata[i] = 2;
        }
    }
    for (var i = 0; i < fourthLayer.length; i++) {
        var ele = fourthLayer[i]
        if (ele !== 0) {
            finaldata[i] = 3;
        }
    }
    for (var i = 0; i < fifthLayer.length; i++) {
        var ele = fifthLayer[i]
        if (ele !== 0) {
            finaldata[i] = 4;
        }
    }
    console.log('gridwidth', gridWidth)
    for (var i = 0; i < finaldata.length; i += gridWidth) {
        grid.push(finaldata.slice(i, i + gridWidth))
    }
    console.log('GRID', grid)
    
    
    return grid
}