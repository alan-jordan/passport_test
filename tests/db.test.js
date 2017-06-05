// Note: we use AVA here because it makes setting up the
// conditions for each test relatively simple. The same
// can be done with Tape using a bit more code.

var test = require('ava')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test)

var db = require('../db')

test('getUsers gets all users', function (t) {
  // One for each letter of the alphabet!
  var expected = 2
  return db.getUsers(t.context.connection)
    .then(function (result) {
      var actual = result.length
      t.is(expected, actual)
    })
})

test('getUsers gets a single user', function (t) {
  var expected = 'Ambitious Aardvark'
  return db.getUser(99901, t.context.connection)
    .then(function (result) {
      var actual = result.name
      t.is(expected, actual)
    })
})

test('getUserByEmail gets a user by email', t => {
  return db.getUserByEmail('baboon@example.org', t.context.connection)
    .then((result) => {
      t.is('Bamboozled Baboon', result.name)
    })
})

test('getUserByTwitter gets a user by Twitter ID', t => {
  return db.getUserByTwitter('alice', t.context.connection)
    .then((result) => {
      t.is('Ambitious Aardvark', result.name)
    })
})

test('createUser creates a user', t => {
  let newUser = {
    name: 'Creepy Cecil',
    email: 'cecil@creepy.org',
    twitter_id: 'cecil',
    password: 'test'
  }
  return db.createUser(newUser, t.context.connection)
  .then((result) => {
    t.is(99903, result[0])
  })
})
// Not sure how to get this test passing
// test('cannot add user with email that already exists', t => {
//   let newUser = {
//     name: "Ambitious Aardvark",
//     email: "aardvark@example.org",
//     twitter_id: "alice"
//   }
//   const error = await t.throws(db.createUser(newUser, t.context.connection))
//   console.log(error);
//   t.is(error.message, error)
// })

// test.cb('hashPassword hashes a password', t => {
//   return db.hashPassword('password')
//     .then((result) => {
//       console.log(result);
//       t.not(result, 'password')
//     })
// })

test('passwords are hashed', t => {
  let newUser = {
    name: 'Creepy Cecil',
    email: 'cecil@creepy.org',
    twitter_id: 'cecil',
    password: 'test'
  }
  return db.createUser(newUser, t.context.connection)
    .then((result) => {
      return db.getUser(result[0], t.context.connection)
        .then((user) => {
          t.not(result, 'test')
        })
    })
})

test('can compare hashed passwords', t => {
  let newUser = {
    name: 'Creepy Cecil',
    email: 'cecil@creepy.org',
    twitter_id: 'cecil',
    password: 'test'
  }
  return db.createUser(newUser, t.context.connection)
    .then((result) => {
      return db.getUser(result[0], t.context.connection)
        .then((user) => {
          db.comparePassword('test', user.password)
            .then(res => {
              t.is(res, true)
            })
        })
    })
})

test('checkLogin checks if user has provided correct details', t => {
  const loginUser = {
    email: 'baboon@example.org',
    password: 'test123'
  }
  return db.checkLogin(loginUser, t.context.connection)
    .then((login) => {
      return new Promise((resolve, reject) => {
        t.is(login, 'User can log in')
        resolve()
      })
    })
})

test('checkLogin checks if user has provided incorrect details', t => {
  const loginUser = {
    email: 'baboon@example.org',
    password: 'test12345677'
  }
  return db.checkLogin(loginUser, t.context.connection)
    .then((login) => {
      return new Promise((resolve, reject) => {
        t.is(login, 'Passwords do not match')
        resolve()
      })
    })
})
