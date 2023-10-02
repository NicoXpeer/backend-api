const express = require('express')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphqlUploadExpress } = require('graphql-upload')
const utilsDB = require('./utils/populateDB')
const config = require('./config')
const { getUserFromToken } = require('./utils/auth')
const connect = require('./db')
const {
  formatDateDirectiveTransformer,
  authorizationDirectiveTransformer,
  authenticationDirectiveTransformer,
} = require('./directives')
const { models } = require('./types')
const { schemaTypes, resolvers } = require('./utils/schema')

const start = async () => {
  const rootSchema = `
    schema {
      query: Query
      mutation: Mutation
    }
  `

  let schema = makeExecutableSchema({
    typeDefs: [rootSchema, ...schemaTypes],
    resolvers: resolvers,
  })

  // TODO: Make it more cool, refactor it ♻️
  schema = formatDateDirectiveTransformer(schema, 'formatDate')
  schema = authorizationDirectiveTransformer(schema, 'authorized')
  schema = authenticationDirectiveTransformer(schema, 'authenticated')

  const server = new ApolloServer({
    schema,
    tracing: true,
    // formatError(err) {
    //   if (err.originalError instanceof AuthenticationError) {
    //     return new Error(err.message)
    //   }
    // },
    async context({ req }) {
      let token = req.headers.authentication

      if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
      }

      console.log('token', token)
      const user = await getUserFromToken(token)
      return { ...models, user }
    },
  })

  await connect(config.dbUrl)
  // await utilsDB.truncateDB()
  // await utilsDB.populateDB()
  await server.start()

  const app = express()

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress())

  server.applyMiddleware({ app })

  await new Promise((r) => app.listen({ port: 4000 }, r))

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  console.log('GQL server config:', config)
}

module.exports = start
