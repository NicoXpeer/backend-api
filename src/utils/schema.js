const { loadFilesSync } = require('@graphql-tools/load-files')
const path = require('path')

// Load TypesDef and resolvers
const schemaTypes = loadFilesSync(path.join(process.cwd(), 'src/**/**/*.gql'))
const resolvers = loadFilesSync(
  path.join(process.cwd(), 'src/types/**/*.resolvers.js')
)

module.exports = {
  schemaTypes,
  resolvers,
}
