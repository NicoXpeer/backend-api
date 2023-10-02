const mongoose = require('mongoose')

const tankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Tank = mongoose.model('tank', tankSchema)

module.exports = Tank
