const tank = async (_, { id }, { Tank }) => {
  return await Tank.findById(id).lean().exec()
}

const tanks = async (_, args, { Tank }) => {
  return await Tank.find({ ...args })
    .lean()
    .exec()
}

const createTank = async (_, args, { user, Tank }) => {
  return await Tank.create({ ...args.input, createdBy: user._id })
}

const updateTank = async (_, { id, input }, { Tank }) => {
  return await Tank.findByIdAndUpdate(id, input, { new: true })
}

const deleteTank = async (_, { id }, { Tank }) => {
  return await Tank.findByIdAndDelete(id)
}

module.exports = {
  Query: {
    tank,
    tanks,
  },
  Mutation: {
    createTank,
    updateTank,
    deleteTank,
  },
}
