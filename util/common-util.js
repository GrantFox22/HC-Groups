/**
 * Module to store common functions
 *
 */
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

function convertIntegerToBoolean (value) {
  if (objectHasContents(value) && isString(value)) {
    if (Number(value) === 1) {
      return true
    } else if (Number(value) === 0) {
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
  const dayOfWeek = date.getDay()
  if (dayOfWeek === 1 || dayOfWeek === 2) {
    return getPreviousSunday()
  } else {
    date.setDate(date.getDate() + (7 - date.getDay()) % 7)
  }
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return date.toLocaleDateString('ko-KR', options)
}

function getPreviousSunday () {
  const date = new Date()
  const dayOfWeek = date.getDay()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }

  if (date.getDay() === 0) {
    date.setDate(date.getDate() - 7)
  } else {
    date.setDate(date.getDate() - dayOfWeek)
  }

  return date.toLocaleDateString('ko-KR', options)
}

function getFormattedDateByDate (fullDate) {
  const date = new Date(fullDate)
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return date.toLocaleDateString('ko-KR', options)
}

function convertBooleanToReportValue (value) {
  if (objectHasContents(value) && value) {
    return 'Yes'
  } else {
    return 'No'
  }
}

module.exports = {
  isString,
  objectHasContents,
  removeAllOccurrencesOfString,
  replaceAllOccurrencesOfString,
  convertStringToBoolean,
  convertIntegerToBoolean,
  getFormattedDate,
  getFormattedDateByDate,
  convertToArray,
  convertBooleanToReportValue,
  getPreviousSunday
}
