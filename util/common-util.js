/**
 * Module to store commonly used functions so they can be called from anywhere
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

function isObject (object) {
  return typeof object === 'object' || object instanceof Object
}

function objectHasContents (object) {
  let hasContents = (object !== null && object !== undefined)

  if (hasContents && isString(object)) {
    hasContents = object.trim() !== ''
  }

  return hasContents
}

function isValidJson (jsonString) {
  try {
    if (stringContainsOnlyNumbers(jsonString)) {
      return false
    }
    JSON.parse(jsonString)
  } catch (error) {
    return false
  }

  return true
}

function stringContainsOnlyNumbers (string) {
  return /^\d+$/.test(string)
}

function formatMessage (message, value) {
  return message.replace('{0}', value)
}

function safeGetValue (value) {
  if (objectHasContents(value)) {
    return value
  } else {
    return ''
  }
}

function removeLine (value, startIndex, linesToDelete) {
  const lines = value.split('\n')
  lines.splice(startIndex, linesToDelete)
  return lines.join('\n')
}

function removeAllOccurrencesOfString (value, stringToRemove) {
  const regex = new RegExp(stringToRemove, 'g')
  return value.replace(regex, '')
}

function getCurrentDateTimeString () {
  const date = new Date()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return date.toLocaleDateString('ko-KR', options) + 'T' + date.toLocaleTimeString()
}

function getDateTimeStringFromDate (date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return date.toLocaleDateString('ko-KR', options) + 'T' + date.toLocaleTimeString()
}

function formatError (error, errorDetail) {
  return error.replace('%O', errorDetail)
}

function getDateMinusOneHour (date) {
  const formattedDate = date.replace('T', ' ').replace('Z', '')
  const adjustedDate = new Date(formattedDate)
  adjustedDate.setHours(adjustedDate.getHours() - 1)
  return adjustedDate.toLocaleDateString() + 'T' + adjustedDate.toLocaleTimeString()
}

function convertToArray (obj) {
  if (Array.isArray(obj)) {
    return obj
  } else {
    return [obj]
  }
}

function getRandomNumericId () {
  return Math.floor(1000000000 + Math.random() * 9000000000)
}

function getRandomPrice () {
  return parseFloat((Math.random() * (8845.120 - 10.0200) + 0.0200).toFixed(2))
}

function setSessionVariable (type, value, req) {
  switch (type) {
    case 'user':
      req.session.user = value
      break
    default:
      break
  }
}

module.exports = {
  isValidJson,
  stringContainsOnlyNumbers,
  isString,
  isObject,
  objectHasContents,
  formatMessage,
  safeGetValue,
  removeLine,
  removeAllOccurrencesOfString,
  convertStringToBoolean,
  getCurrentDateTimeString,
  getDateTimeStringFromDate,
  formatError,
  getDateMinusOneHour,
  convertToArray,
  getRandomNumericId,
  getRandomPrice,
  setSessionVariable
}
