export default function createGrid (mapdata) {
  const gridWidth = mapdata.width
  const grid = []
  const layers = mapdata.layers

  const secondLayer = layers[1].data
  const thirdLayer = layers[2].data
  const fourthLayer = layers[3].data
  const fifthLayer = layers[4].data

  const finaldata = []

  for (let i = 0; i < 30 * 25; i++) {
    finaldata.push(0)
  }

  for (let i = 0; i < secondLayer.length; i++) {
    let ele = secondLayer[i]
    if (ele !== 0) {
      finaldata[i] = 1
    }
  }
  for (let i = 0; i < thirdLayer.length; i++) {
    let ele = thirdLayer[i]
    if (ele !== 0) {
      finaldata[i] = 2
    }
  }
  for (let i = 0; i < fourthLayer.length; i++) {
    let ele = fourthLayer[i]
    if (ele !== 0) {
      finaldata[i] = 3
    }
  }
  for (let i = 0; i < fifthLayer.length; i++) {
    let ele = fifthLayer[i]
    if (ele !== 0) {
      finaldata[i] = 4
    }
  }
  for (let i = 0; i < finaldata.length; i += gridWidth) {
    grid.push(finaldata.slice(i, i + gridWidth))
  }

  return grid
}
