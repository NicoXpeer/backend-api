const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    cif: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Company = mongoose.model('company', companySchema)

module.exports = Company
