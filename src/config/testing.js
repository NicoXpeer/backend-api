const config = {
  secrets: {
    jwt: 'testing',
    jwtExp: { expiresIn: 60 * 60 * 24 },
  },
  dbUrl: 'mongodb://localhost:27017/api-testing',
}

module.exports = config
