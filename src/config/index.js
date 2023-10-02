const { merge } = require('lodash')
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  port: 4000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d',
  },
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev')
    break
  case 'test':
  case 'testing':
    envConfig = require('./testing')
    break
  case 'cloud':
    envConfig = require('./cloud')
    break
  default:
    envConfig = require('./dev')
}

const aux = merge(baseConfig, envConfig)

module.exports = aux
