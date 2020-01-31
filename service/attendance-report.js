const commonUtil = require('../util/common-util')

function getAllSundaysInYear (year) {
  return getSundays(new Date(year, 0, 1), new Date(year, 11, 31), 'Sun')
}

function getSundays (start, end, dayName) {
  const sundays = []
  const days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
  const day = days[dayName.toLowerCase().substr(0, 3)]
  const currentDate = new Date(start)
  currentDate.setDate(currentDate.getDate() + (day - currentDate.getDay() + 7) % 7)
  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate < end) {
    sundays.push(commonUtil.getFormattedDateByDate(new Date(+currentDate)))
    currentDate.setDate(currentDate.getDate() + 7)
  }
  return sundays
}

module.exports = {
  getAllSundaysInYear
}
