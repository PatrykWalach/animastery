const request = require('request')
const { readFileSync } = require('fs')
const { createCanvas, loadImage } = require('canvas')
const data = JSON.parse(readFileSync(__dirname + '/data.json', 'utf8'))

module.exports.fetchPNG = ({ width, height }) => async (
  { params, isAchived },
  res,
) => {
  const { genre, level } = params

  try {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const imageBuffer = await new Promise((resolve, reject) =>
      request(
        {
          method: 'GET',
          encoding: null,
          url: data[genre.toLowerCase()][level][isAchived ? 'fullfilled' : 'pending'],
        },
        (error, response, buffer) => {
          if (error) {
            reject(error)
          }
          resolve(buffer)
        },
      ),
    )

    const image = await loadImage(imageBuffer)
    ctx.drawImage(image, 0, 0, width, height)

    canvas.createPNGStream().pipe(res)
  } catch (e) {
    console.error(e)
    res.send(e)
  }
}
