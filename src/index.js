const express = require('express')
// const { promises } = require('fs')

const { checkUserStats } = require('./checkUserStats')
const { fetchPNG } = require('./fetchPNG')

const app = express()

let port = process.env.PORT
if (port == null || port == '') {
  port = 8080
}

const HANDLERS = [
  checkUserStats({
    levels: ['bronze', 'silver', 'gold'],
  }),
  fetchPNG({
    width: 520,
    height: 720,
  }),
]

app.get('/:username/:mediaType/:genre/:level.png', HANDLERS)

app.get('/:username/:mediaType/:genre.png', HANDLERS)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

// x = [...document.querySelectorAll('img[src*=Mastery]')]
//   .map(({ src }) => src)
//   .reduce((acc, src) => {
//     const [, rawGenre, rawRank, bw] = src.match(
//       /([^\/]+)[-_]Mastery[-_]?([^]*?)[-_]?(BW)?.png/,
//     )
//     const genre = rawGenre.toLowerCase()
//     const rank = rawRank.toLowerCase()

//     if (!(genre in acc)) {
//       acc[genre] = {}
//     }

//     if (!(rank in acc[genre])) {
//       acc[genre][rank] = {}
//     }

//     acc[genre][rank][bw ? 'pending' : 'fullfilled'] = src

//     return acc
//   }, {})
