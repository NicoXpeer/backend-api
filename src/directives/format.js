const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils')
const { defaultFieldResolver, GraphQLString } = require('graphql')
const { formatDate } = require('../utils/format')

function formatDateDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const formatDateDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )

      if (formatDateDirective && formatDateDirective[0]) {
        const format = formatDateDirective[0].format

        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info)
          if (typeof result === 'object') {
            return formatDate(result, format)
          }
          return result
        }
        return fieldConfig
      }
    },
  })
}

module.exports = {
  formatDateDirectiveTransformer,
}
