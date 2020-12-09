const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const reviews = [
  {id: 1, user: {id: 1}, message: 'This is awesome!!', remoteId: 'xxx'},
  {id: 2, user: {id: 1}, message: 'Why even do this?', remoteId: 'yyy'},
  {id: 3, user: {id: 2}, message: 'Its okay', remoteId: 'xxx'},
]

const typeDefs = gql`
  type Query {
    allReviews: [Review]
  }

  type Review {
    id: Int!
    user: ReviewUser
    message: String
    remoteId: String
  }

  type ReviewUser {
    id: Int!
  }
`;

const resolvers = {
  Query: {
    allReviews() {
      return reviews
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 User Server ready at ${url}`);
});