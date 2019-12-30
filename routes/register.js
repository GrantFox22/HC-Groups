require('dotenv').config()
const debug = require('../config/debug')('app:register')
const PasswordValidator = require('password-validator')
const express = require('express')
const hcDao = require('../repository/hc-dao')
const bcrypt = require('bcrypt')
const router = express.Router()
const schema = new PasswordValidator()

schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().symbols() // Must have symbols
  .has().not().spaces() // Should not have spaces

/* GET register page. */
router.get('/', async function (req, res, next) {
  res.render('register', { passwordValidator: schema })
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
