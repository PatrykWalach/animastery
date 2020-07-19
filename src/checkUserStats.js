const { client } = require('./client')
const { gql } = require('@apollo/client')

module.exports.checkUserStats = async (req, res, next) => {
  const { username, genre, level, mediaType } = req.params

  const lowerCaseMediaType = mediaType.toLowerCase()
  if (lowerCaseMediaType !== 'anime' && lowerCaseMediaType !== 'manga') {
    throw new Error('invalid media type')
  }

  try {
    const { data } = await client.query({
      variables: {
        name: username,
      },
      query: gql`
        ${`
      query UserQuery($name: String!) {
        User(name: $name) {
          id
          statistics {
            ${lowerCaseMediaType} {
              genres {
                genre
                count
              }
            }
          }
        }
      }`}
      `,
    })
    const user = data.User

    if (!user) {
      throw new Error('could not find user')
    }

    const { count = 0 } =
      data.User.statistics[lowerCaseMediaType].genres.find(
        (genreStatistic) =>
          genreStatistic.genre.toLowerCase() === genre.toLowerCase(),
      ) || {}

    req.isAchived = count >= level * 200

    next()
  } catch (e) {
    console.error(e)
    res.send(e)
  }
}
