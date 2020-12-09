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

  type Review @key(fields: "id") {
    id: Int!
    userId: Int
    message: String
    remoteId: String
    user: User
  }

  extend type User @key(fields: "id") {
    id: Int! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Query: {
    allReviews() {
      return reviews
    },
  },
  Review: {
    __resolveReference(review, context) {
      return reviews.find((r) => r.id === review.id);
    }
  },
  User: {
    reviews(user) {
      return reviews.filter((r) => r.user.id === user.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 User Server ready at ${url}`);
});