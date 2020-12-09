const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const users = [
  {id: 1, username: 'Bob'},
  {id: 2, username: 'Lob'},
  {id: 3, username: 'Rob'},
  {id: 4, username: 'Kob'},
]

const typeDefs = gql`
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: Int!
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0]
    }
  },
  User: {
    __resolveReference(user, context) {
      return users.find((u) => u.id === user.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 User Server ready at ${url}`);
});