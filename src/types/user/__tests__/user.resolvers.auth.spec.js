const { AuthenticationError, ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const gql = require('graphql-tag')
const { models } = require('../../../types')
const { schemaTypes, resolvers } = require('../../../utils/schema')
const {
  formatDateDirectiveTransformer,
  authorizationDirectiveTransformer,
  authenticationDirectiveTransformer,
} = require('../../../directives')

describe('User resolvers with auth', () => {
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

  const createTestServer = (ctx) => {
    const server = new ApolloServer({
      schema,
      mockEntireSchema: false,
      mocks: true,
      context: () => ctx,
    })

    return createTestClient(server)
  }

  // QUERIES
  describe('Queries', () => {
    const USER = gql`
      query user($id: ID!) {
        user(id: $id) {
          _id
          name
        }
      }
    `

    const USERS = gql`
      query users {
        users {
          _id
          name
        }
      }
    `

    test('user gets one by id in args not authenticated', async () => {
      const { query } = createTestServer({
        ...models,
      })

      const result = await query({
        query: USER,
        variables: { id: '12ewe3q2' },
      })
      expect(result.errors).not.toBe(undefined)
      expect(result.data).not.toBeTruthy()
    })

    test('user gets one by id in args as admin', async () => {
      const { query } = createTestServer({
        user: { id: '2ea323rr3r3', role: 'SUPER_ADMIN' },
        ...models,
      })

      const company = await models.Company.create({
        name: 'KOA-BIOTECH',
        phone: '1234567',
        address: 'Calle de la piruleta',
        country: 'Spain',
        cif: '123245432456',
      })

      const user = await models.User.create({
        name: 'Nico',
        surname1: 'Acosta',
        surname2: 'Pachon',
        email: 'nicoacosta@gmail.com',
        password: '12345',
        role: 'SUPER_ADMIN',
        company: company._id,
      })

      const result = await query({
        query: USER,
        variables: { id: user.id },
      })

      console.log(result)
      expect(result.errors).toBe(undefined)
      expect(`${result.data.user._id}`).toBe(`${user._id}`)
    })

    test('users gets all users not authenticated', async () => {
      const { query } = createTestServer({
        ...models,
      })

      const result = await query({
        query: USERS,
      })

      expect(result.errors).not.toBe(undefined)
      expect(result.data).not.toBeTruthy()
    })

    test('users gets all users as admin', async () => {
      const { query } = createTestServer({
        user: { id: '2ea323rr3r3', role: 'ADMIN' },
        ...models,
      })

      const company = await models.Company.create({
        name: 'KOA-BIOTECH',
        phone: '1234567',
        address: 'Calle de la piruleta',
        country: 'Spain',
        cif: '123245432456',
      })

      const users = await models.User.create(
        {
          name: 'Nico',
          surname1: 'Acosta',
          surname2: 'Pachon',
          email: 'nicoacosta@gmail.com',
          password: '12345',
          role: 'ADMIN',
          company: company._id,
        },
        {
          name: 'Joan',
          surname1: 'Rao',
          surname2: 'de Azua',
          email: 'joanrao@gmail.com',
          password: '56789',
          role: 'ADMIN',
          company: company._id,
        }
      )

      const result = await query({
        query: USERS,
      })

      expect(result.errors).toBe(undefined)
      expect(result.data.users).toHaveLength(2)
      users.forEach((u) => {
        const match = result.data.users.find((r) => `${r._id}` === `${u._id}`)
        expect(match).toBeTruthy()
      })
    })
  })
})
