const device = async (_, { id }, { Device }) => {
  return await Device.findById(id).lean().exec()
}

const devices = async (_, __, { Device }) => {
  return await Device.find().lean().exec()
}

const createDevice = async (_, { input }, { Device }) => {
  return await Device.create({ ...input })
}

const updateDevice = async (_, { id, input }, { Device }) => {
  return await Device.findByIdAndUpdate(id, input, { new: true }).lean().exec()
}

const deleteDevice = async (_, { id }, { Device }) => {
  return await Device.findByIdAndDelete(id)
}

module.exports = {
  Query: {
    device,
    devices,
  },
  Mutation: {
    createDevice,
    updateDevice,
    deleteDevice,
  },
  Device: {
    async tank(device, __, { Tank }) {
      return await Tank.findById(device.tank).lean().exec()
    },
    // ,
    // async user(device, __, { User }) {
    //   return await User.findById(device.user).lean().exec()
    // },
  },
}
