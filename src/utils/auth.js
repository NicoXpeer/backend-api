const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { models } = require('../types')
const { secrets } = require('../config')

const createToken = ({ _id, role }) =>
  jwt.sign({ id: _id.toHexString(), role }, secrets.jwt, secrets.jwtExp)

const getUserFromToken = async (token) => {
  try {
    const user = jwt.verify(token, secrets.jwt)
    const found = await models.User.findById(user.id).lean().exec()
    return found
  } catch (e) {
    return null
  }
}

const authenticated = (next) => (root, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError('must authenticate')
  }

  return next(root, args, context, info)
}

const authorized = (role, next) => (root, args, context, info) => {
  if (context.user.role !== role) {
    throw new AuthenticationError(`you must have ${role} role`)
  }

  return next(root, args, context, info)
}

module.exports = {
  getUserFromToken,
  authenticated,
  authorized,
  createToken,
}
