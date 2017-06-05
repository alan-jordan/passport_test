var test = require('ava')
var request = require('supertest')
var cheerio = require('cheerio')

var createServer = require('../server')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test, createServer)

test('GET /', (t) => {
  return request(t.context.app)
    .get('/')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('li').first().text(), 'Ambitious Aardvark (aardvark@example.org)')
    })

})

test('GET /login', t => {
  return request(t.context.app)
    .get('/login')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Login')
    })
})

test('Post /signup', t => {
  const newUser = {
    name: 'Dopey Derek',
    email: 'derek@dopey.org',
    twitter_id: 'derek',
    password: 'test123'
  }
  return request(t.context.app)
    .post('/signup')
    .send(newUser)
    .expect(201)
})

test('Post /login', t => {
  const loginUser = {
    email: 'baboon@example.org',
    password: 'test123'
  }
  return request(t.context.app)
    .post('/login')
    .send(loginUser)
    .expect(200)
    .then((res) => {
      t.is(res.text, 'User can log in')
    })
})

test('Get /logout', t => {
  return request(t.context.app)
    .get('/logout')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Logout')
    })
})

test('Get /auth/twitter', t => {
  return request(t.context.app)
    .get('/auth/twitter')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Twitter')
    })
})

test('Get /auth/twitter/logout', t => {
  return request(t.context.app)
    .get('/auth/twitter/callback')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Twitter Callback')
    })
})

test('Get /transactions', t => {
  return request(t.context.app)
    .get('/transactions')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Transactions')
    })
})

test('Get /users/:id/profile/edit', t => {
  return request(t.context.app)
    .get('/users/99901/profile/edit')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Edit Profile')
    })
})
