/**
 * Module to store common functions
 *
 */
require('dotenv').config()

function convertStringToBoolean (value) {
  if (objectHasContents(value) && isString(value)) {
    if (value.toLowerCase() === 'true') {
      return true
    } else if (value.toLowerCase() === 'false') {
      return false
    } else {
      return null
    }
  } else {
    return null
  }
}

function isString (object) {
  return typeof object === 'string' || object instanceof String
}

function convertToArray (object) {
  if (!objectHasContents(object)) {
    return []
  }
  if (!Array.isArray(object)) {
    return [object]
  }
  return object
}

function objectHasContents (object) {
  let hasContents = (object !== null && object !== undefined)

  if (hasContents && isString(object)) {
    hasContents = object.trim() !== ''
  }

  return hasContents
}

function removeAllOccurrencesOfString (value, stringToRemove) {
  const regex = new RegExp(stringToRemove, 'g')
  return value.replace(regex, '')
}

function replaceAllOccurrencesOfString (value, stringToRemove, stringToReplace) {
  const regex = new RegExp(stringToRemove, 'g')
  return value.replace(regex, stringToReplace)
}

function getFormattedDate () {
  const date = new Date()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return date.toLocaleDateString('ko-KR', options)
}

module.exports = {
  isString,
  objectHasContents,
  removeAllOccurrencesOfString,
  replaceAllOccurrencesOfString,
  convertStringToBoolean,
  getFormattedDate,
  convertToArray
}
