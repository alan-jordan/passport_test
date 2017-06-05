var express = require('express')
var router = express.Router()

var db = require('../db')

router.get('/', function (req, res) {
  db.getUsers(req.app.get('connection'))
    .then(function (users) {
      res.render('index', { users: users })
    })
    .catch(function (err) {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/signup', (req, res) => {
  db.createUser(req.body, req.app.get('connection'))
    .then(() => {
      res.sendStatus(201)
    })
    .catch((err) => {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})

router.post('/login', (req, res) => {
  db.checkLogin(req.body, req.app.get('connection'))
  .then(() => {
    res.send('User can log in').status(200)
  })
  .catch((err) => {
    res.status(500).send('DATABASE ERROR: ' + err.message)
  })
})

router.get('/logout', (req, res) => {
  res.render('logout')
})

module.exports = router
