const bcrypt = require('bcrypt')
const validator = require('../validation/register-validator')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET register page. */
router.get('/', async function (req, res, next) {
  res.render('register', { hasErrors: validator.getDefaultResponse().hasErrors, errors: validator.getDefaultResponse().errors, username: null, registrationFailureError: null, invalidUserError: null, success: false })
})

router.post('/', async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const validationResponse = validator.validateRegistration(username, password, confirmPassword)
  if (validationResponse.hasErrors) {
    res.render('register', { hasErrors: validationResponse.hasErrors, errors: validationResponse.errors, username: username, registrationFailureError: null, invalidUserError: null, success: false })
  } else {
    bcrypt.hash(password, 13)
      .then(function (hashedPassword) {
        return hcDao.registerLeader(hashedPassword, username.toLowerCase())
      })
      .then(function (result) {
        if (result > 0) {
          res.render('register', { hasErrors: validationResponse.hasErrors, errors: validationResponse.errors, username: username, registrationFailureError: null, invalidUserError: null, success: true })
        } else if (result === 0) {
          res.render('register', { hasErrors: validationResponse.hasErrors, errors: validationResponse.errors, username: username, registrationFailureError: null, invalidUserError: 'User "' + username + '" is not a valid user.', success: false })
        } else if (result === -1) {
          res.render('register', { hasErrors: validationResponse.hasErrors, errors: validationResponse.errors, username: username, registrationFailureError: 'Error: Failed to register user ' + username + '. Please try again later.', invalidUserError: null, success: false })
        }
      })
      .catch(function (error) {
        console.log('Error registering user: ' + error)
        next()
      })
  }
})

module.exports = router
