const commonUtil = require('../util/common-util')
const PasswordValidator = require('password-validator')
const passwordValidationSchema = new PasswordValidator()
const defaultErrors = {
  registrationError: null,
  passwordMismatchError: null,
  passwordNotValidError: null,
  noUsernameError: null,
  noPasswordError: null,
  noConfirmPasswordError: null
}

function validateRegistration (email, password, confirmPassword) {
  const errors = {
    registrationError: null,
    passwordMismatchError: null,
    passwordNotValidError: null,
    noUsernameError: null,
    noPasswordError: null,
    noConfirmPasswordError: null
  }
  const validationResponse = {
    hasErrors: false,
    errors: errors
  }

  passwordValidationSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces()

  if (!commonUtil.objectHasContents(email)) {
    errors.noUsernameError = 'Email Address is a required field'
    validationResponse.hasErrors = true
  }
  if (!commonUtil.objectHasContents(password)) {
    errors.noPasswordError = 'Create Password is a required field'
    validationResponse.hasErrors = true
  }
  if (!commonUtil.objectHasContents(confirmPassword)) {
    errors.noConfirmPasswordError = 'Confirm Password is a required field'
    validationResponse.hasErrors = true
  }
  if (password !== confirmPassword) {
    errors.passwordMismatchError = 'Passwords do not match'
    validationResponse.hasErrors = true
  } else if (!passwordValidationSchema.validate(password)) {
    errors.passwordNotValidError = 'Password must be between 8-20 characters long and must contain Uppercase Letters, Lowercase Letters, Numbers, and at least 1 Special Character'
    validationResponse.hasErrors = true
  }

  return validationResponse
}

function getDefaultResponse () {
  return {
    hasErrors: false,
    errors: defaultErrors
  }
}

module.exports = {
  validateRegistration,
  getDefaultResponse
}
