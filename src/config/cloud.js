const config = {
  secrets: {
    jwt: 'development',
    jwtExp: { expiresIn: 500000000000 },
  },
  dbUrl:
    'mongodb+srv://admin:admin@apollo-server.9janh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
}

module.exports = config
