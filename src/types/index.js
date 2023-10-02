// Models
const User = require('./user/user.model')
const Company = require('./company/company.model')
const Device = require('./device/device.model')
const Tank = require('./tank/tank.model')

module.exports = {
  models: {
    User,
    Company,
    Device,
    Tank,
  },
}
