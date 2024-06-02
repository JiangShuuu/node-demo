import { createServer } from 'node:http'
import { createYoga, createSchema } from 'graphql-yoga'

// db
import db from "./db"

// types
import { typeDefs } from "./schema";


const resolvers = {
  Query: {
    reviews() {
      return db.reviews;
    },
    games() {
      return db.games;
    },
    authors() {
      return db.authors;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter(r => r.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter(r => r.author_id === parent.id)
    }
  },
  Review: {
    author(parent) {
      return db.authors.find(a => a.id === parent.author_id)
    },
    game(parent) {
      return db.games.find(g => g.id === parent.game_id)
    },
  },
  Mutation: {
    deleteGame(_, args) {
      return db.games.filter(g => g.id !== args.id)
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }

      db.games.push(game)

      return game
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return {...g, ...args.edits}
        }
        return g
      })
      return db.games.find((g) => g.id === args.id)
    }
  }
}
const schema = createSchema({
  typeDefs,
  resolvers
})
 
// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema })
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})