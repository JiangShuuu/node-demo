import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"

// db
import db from "./db.js"

// types
import { typeDefs } from "./schema.js";


const resolvers = {
  Query: {
    reviews() {
      return db.reviews;
    },
    games () {
      return db.games;
    },
    authors () {
      return db.authors;
    }
  }
}

// server setup
const server = new ApolloServer({
  // typeDefs -- definitions of types of data
  typeDefs,
  // resolvers
  resolvers,
  // context
});

const { url } = await startStandaloneServer(server, {
  listen: {port: 4000},
});

console.log('Server readt at port', 4000)