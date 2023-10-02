const { AuthenticationError } = require('apollo-server')
const { createToken } = require('../../utils/auth')
const { GraphQLUpload } = require('graphql-upload')
// const { finished } = require('stream/promises')

const userTypeMatcher = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  BASIC: 'Basic',
}

const user = async (_, { id }, { User }) => {
  return await User.findById(id).lean().exec()
}

const users = async (_, __, { User }) => {
  return await User.find().lean().exec()
}

const createUser = async (_, { input }, { User }) => {
  return await User.create({ ...input })
}

const updateUser = async (_, { id, input }, { User }) => {
  const result = await User.findByIdAndUpdate(id, input, { new: true })
    .lean()
    .exec()
  console.log('result:', result)
  return result
}

const removeUser = async (_, { id }, { User }) => {
  return await User.findByIdAndDelete(id)
}

const signin = async (_, { input }, { User, userCtx }) => {
  const user = await User.findOne({ email: input.email }).lean().exec()

  if (!user) {
    throw new AuthenticationError('user not found')
  }

  const userDBModel = new User({ password: user.password })
  const isPasswordRight = await userDBModel.checkPassword(input.password)

  if (!isPasswordRight) {
    throw new AuthenticationError('incorrect credentials')
  }

  const token = createToken(user)

  return { token, user }
}

const signup = async (_, { input }, { User }) => {
  const user = await User.findOne({ email: input.email })

  if (!user) {
    throw new Error('Oops, an error appeared. Please report to Ipsum Sports.')
  }

  user.password = input.password
  user.save()
  const token = createToken(user)

  return { token, user }
}

const singleUpload = async (parent, { file }) => {
  const { createReadStream, filename, mimetype, encoding } = await file

  // Invoking the `createReadStream` will return a Readable Stream.
  // See https://nodejs.org/api/stream.html#stream_readable_streams
  const stream = createReadStream()

  // This is purely for demonstration purposes and will overwrite the
  // local-file-output.txt in the current working directory on EACH upload.
  const out = require('fs').createWriteStream('local-file-output.txt')
  stream.pipe(out)
  // await finished(out)

  return { filename, mimetype, encoding }
}

module.exports = {
  Query: {
    user,
    users,
  },
  Mutation: {
    createUser,
    updateUser,
    removeUser,
    signin,
    signup,
    singleUpload,
  },
  Upload: GraphQLUpload,
  User: {
    async __resolveType(user) {
      return userTypeMatcher[user.role]
    },
    async company(user, __, { ctxUser, Company }) {
      return await Company.findById(user.company).lean().exec()
    },
    async devices(user, __, { ctxUser, Device }) {
      return await Device.findById(user.device).lean().exec()
    },
  },
}
