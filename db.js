var bcrypt = require('bcryptjs');

module.exports = {
  getUser: getUser,
  getUsers: getUsers,
  getUserByEmail: getUserByEmail,
  getUserByTwitter: getUserByTwitter,
  createUser: createUser,
  comparePassword: comparePassword,
  checkLogin: checkLogin
}

function getUsers (connection) {
  return connection('users').select()
}

function getUser (id, connection) {
  return connection('users').where('id', id).first()
}

function getUserByEmail (email, connection) {
  return connection('users').where('email', email).first()
}

function getUserByTwitter (twitterId, connection) {
  return connection('users').where('twitter_id', twitterId).first()
}

function createUser (userObj, connection) {
  return bcrypt.hash(userObj.password, 10)
    .then((hash) => {
      userObj.password = hash
      return connection('users')
        .insert(userObj)
    })
}

function comparePassword(plainTextPassword, hashedPassword) {
  return bcrypt.compare(plainTextPassword, hashedPassword)
    .then(res => {
      return res
    })
}

function checkLogin(loginObj, connection) {
  return getUserByEmail(loginObj.email, connection)
    .then((user) => {
      return comparePassword(loginObj.password, user.password)
        .then((match) => {
          return match ? 'User can log in' : 'Passwords do not match'
        })
    })
}
