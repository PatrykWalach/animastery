module.exports = {
  client: {
    includes: ['src/**/*.vue', '**/*.gql', 'src/**/*.ts', '**/*.graphql'],
    service: {
      name: 'anilist',
      url: 'https://graphql.anilist.co',
    },
  },
}
