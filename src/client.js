const fetch = require("cross-fetch");
const { ApolloClient, InMemoryCache, HttpLink } = require("@apollo/client");
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "https://graphql.anilist.co", fetch }),
});

module.exports.client = client;
