const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
    },
    speed: {
      type: Number,
    },
    analysis: {
      type: String,
    },
    location: {
      type: String,
    },
    tank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tank',
      required: true,
    },
  },
  { timestamps: true }
)

const Device = mongoose.model('device', deviceSchema)

module.exports = Device
