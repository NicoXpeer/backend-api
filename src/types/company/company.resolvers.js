const company = async (_, { id }, { Company }) => {
  return await Company.findById(id).lean().exec()
}

const companies = async (_, args, { Company }) => {
  return await Company.find({ ...args })
    .lean()
    .exec()
}

const createCompany = async (_, args, { user, Company }) => {
  return await Company.create({ ...args.input, createdBy: user._id })
}

const updateCompany = async (_, { id, input }, { Company }) => {
  return await Company.findByIdAndUpdate(id, input, { new: true })
}

const deleteCompany = async (_, { id }, { Company }) => {
  return await Company.findByIdAndDelete(id)
}

module.exports = {
  Query: {
    company,
    companies,
  },
  Mutation: {
    createCompany,
    updateCompany,
    deleteCompany,
  },
}
