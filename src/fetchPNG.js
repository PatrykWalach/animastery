const request = require('request')
const { readFileSync } = require('fs')
const { createCanvas, loadImage } = require('canvas')
const data = JSON.parse(readFileSync(__dirname + '/data.json', 'utf8'))

const fetchImage = (url) =>
  new Promise((resolve, reject) =>
    request(
      {
        method: 'GET',
        encoding: null,
        url,
      },
      (error, response, buffer) => {
        if (error) {
          reject(error)
        }
        resolve(buffer)
      },
    ),
  )

module.exports.fetchPNG = ({ width, height }) => async (
  { params, isAchived },
  res,
) => {
  const { genre, level } = params

  try {
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const imageBuffer = await fetchImage(
      data[genre.toLowerCase()][level][isAchived ? 'fullfilled' : 'pending'],
    )

    const image = await loadImage(imageBuffer)
    ctx.drawImage(image, 0, 0, width, height)

    res.set('Cache-Control', 'public, max-age=86400');
    canvas.createPNGStream().pipe(res)
  } catch (e) {
    console.error(e)
    res.send(e)
  }
}
