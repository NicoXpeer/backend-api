const dfnsFormat = require('date-fns/format')

const formatDate = (stamp, format) => dfnsFormat(new Date(), format)

module.exports = {
  formatDate,
}
