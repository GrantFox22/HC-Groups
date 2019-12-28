require('dotenv').config()
const debug = require('../config/debug')('app:register')
const express = require('express')
const hcDao = require('../repository/hc-dao')
const bcrypt = require('bcrypt')
const router = express.Router()

/* GET register page. */
router.get('/', async function (req, res, next) {
  res.render('register', { user: 'grant.fox' })
})

router.post('/', async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password

  bcrypt.hash(password, 13)
    .then(function (hashedPassword) {
      return hcDao.registerLeader(hashedPassword, username)
    })
    .then(function (result) {
      if (result === 1) {
        res.redirect('login')
      } else {
        res.redirect('error')
      }
    })
    .catch(function (error) {
      debug('Error registering user: %O', error)
      next()
    })
})

module.exports = router
