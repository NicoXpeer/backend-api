const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils')
const { AuthenticationError } = require('apollo-server')
const { defaultFieldResolver } = require('graphql')

function authenticationDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authenticatedDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )

      if (authenticatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, ctx, info) {
          const result = await resolve(source, args, ctx, info)

          if (!ctx.user) {
            throw new AuthenticationError('not auth')
          }
          return result
        }
        return fieldConfig
      }
    },
  })
}

function authorizationDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authenticatedDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )

      if (authenticatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        const roles = authenticatedDirective[0].roles
        const fieldName = fieldConfig.astNode.name.value
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, ctx, info) {
          const result = await resolve(source, args, ctx, info)

          if (!ctx.user || !roles.find((role) => role === ctx.user.role)) {
            throw new AuthenticationError(
              `wrong role, needs to be a ${roles} to view/use ${fieldName}, you're a ${ctx.user.role}`
            )
          }
          return result
        }
        return fieldConfig
      }
    },
  })
}

module.exports = {
  authenticationDirectiveTransformer,
  authorizationDirectiveTransformer,
}
