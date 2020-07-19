const { client } = require('./client')
const { gql } = require('@apollo/client')

const fetchUserData = (username) =>
  client.query({
    variables: {
      name: username,
    },
    query: gql`
      query UserQuery($name: String!) {
        User(name: $name) {
          id
          statistics {
            anime {
              genres {
                genre
                count
              }
            }
            manga {
              genres {
                genre
                count
              }
            }
          }
        }
      }
    `,
  })

module.exports.checkUserStats = ({ levels }) => async (req, res, next) => {
  const { username, genre, level, mediaType } = req.params
  try {
    const lowerCaseMediaType = mediaType.toLowerCase()
    if (lowerCaseMediaType !== 'anime' && lowerCaseMediaType !== 'manga') {
      throw new Error('invalid media type')
    }

    const { data } = await fetchUserData(username)
    const user = data.User

    if (!user) {
      throw new Error('could not find user')
    }

    const { count = 0 } =
      data.User.statistics[lowerCaseMediaType].genres.find(
        (genreStatistic) =>
          genreStatistic.genre.toLowerCase() === genre.toLowerCase(),
      ) || {}

    const userLevel = Math.floor(count / 200) - 1

    if (!level) {
      const [lowestLevel] = levels
      req.params.level = levels[userLevel] || lowestLevel
    }

    const requestedLevel = levels.indexOf(req.params.level.toLowerCase())

    if (requestedLevel < 0) {
      throw new Error('unknown mastery level')
    }

    req.isAchived = userLevel >= requestedLevel

    next()
  } catch (e) {
    console.error(e)
    res.send(e)
  }
}
