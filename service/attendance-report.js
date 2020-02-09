const fs = require('fs')
const stringFormat = require('string-format')
const commonUtil = require('../util/common-util')
const hcDao = require('../repository/hc-dao')
const attendanceReport = require('../domain/attendance-report')

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

async function getAttendanceReport (groupId, meetingDate, groupName) {
  const result = {
    success: false,
    attendanceReport: null,
    error: null
  }
  const attendanceStatistics = await hcDao.getAttendanceStatisticsReport(groupId, meetingDate)
  if (commonUtil.objectHasContents(attendanceStatistics)) {
    const membersAttendance = await hcDao.getMemberAttendanceReport(groupId, meetingDate)
    if (commonUtil.objectHasContents(membersAttendance)) {
      const guestsAttendance = await hcDao.getGuestsAttendanceReport(groupId, meetingDate)
      if (commonUtil.objectHasContents(guestsAttendance)) {
        result.attendanceReport = buildAttendanceReport(attendanceStatistics, membersAttendance, guestsAttendance, groupName, groupId)
        result.success = true
        return result
      } else {
        result.error = 'Failed to get Guests Report'
        return result
      }
    } else {
      result.error = 'Failed to get Members Report'
      return result
    }
  } else {
    result.error = 'Failed to get Attendance Report'
    return result
  }
}

function buildAttendanceReport (attendanceStatistics, membersAttendance, guestsAttendance, groupName, groupId) {
  const smallGroupAttendanceReport = new attendanceReport.SmallGroupAttendanceReport()
  smallGroupAttendanceReport.groupName = groupName
  smallGroupAttendanceReport.groupId = groupId
  if (commonUtil.objectHasContents(attendanceStatistics) && attendanceStatistics.length > 0) {
    smallGroupAttendanceReport.totalMembers = attendanceStatistics[0].total_members
    smallGroupAttendanceReport.totalMembersAttended = attendanceStatistics[0].total_members_attended
    smallGroupAttendanceReport.percentAttended = attendanceStatistics[0].percent_attended
  }
  if (commonUtil.objectHasContents(membersAttendance) && membersAttendance.length > 0) {
    smallGroupAttendanceReport.meetingDate = commonUtil.getFormattedDateByDate(membersAttendance[0].meeting_date)
    for (let i = 0; i < membersAttendance.length; i++) {
      smallGroupAttendanceReport.memberFirstName.push(membersAttendance[i].first_name)
      smallGroupAttendanceReport.memberLastName.push(membersAttendance[i].last_name)
      smallGroupAttendanceReport.attended.push(commonUtil.convertIntegerToBoolean(membersAttendance[i].attended))
    }
  } else {
    smallGroupAttendanceReport.meetingDate = commonUtil.getFormattedDate()
  }
  if (commonUtil.objectHasContents(guestsAttendance) && guestsAttendance.length > 0) {
    for (let i = 0; i < guestsAttendance.length; i++) {
      if (!commonUtil.objectHasContents(guestsAttendance[i].guest_first_name) && !commonUtil.objectHasContents(guestsAttendance[i].guest_last_name)) {
        // Skip this as this was an accidental entry
      } else {
        smallGroupAttendanceReport.guestFirstName.push(guestsAttendance[i].guest_first_name)
        smallGroupAttendanceReport.guestLastName.push(guestsAttendance[i].guest_last_name)
      }
    }
  }
  return smallGroupAttendanceReport
}

async function saveReport (attendanceReports, meetingDate) {
  let data = ''
  for (const report of attendanceReports) {
    const smallGroupReport = '------------------------------------------------------------------------------------------------------------------------------\n' +
      'GROUP: {0} | MEETING DATE: ' + meetingDate + '\n' +
      '------------------------------------------------------------------------------------------------------------------------------\n' +
      '\n' +
      'ATTENDANCE STATISTICS for ' + report.groupName + '\'s Small Group:\n' +
      '\n' +
      '\tTOTAL MEMBERS: {1} \n' +
      '\tTOTAL MEMBERS ATTENDED: {2} \n' +
      '\tPERCENT ATTENDED: {3}%\n' +
      '\n' +
      'MEMBER ATTENDANCE REPORT for ' + report.groupName + '\'s Small Group:\n' +
      '\n' +
      '{4}' +
      '\n' +
      'GUEST ATTENDANCE REPORT for ' + report.groupName + '\'s Small Group:\n' +
      '\n' +
      '{5}\n\n'
    let memberData = ''
    let guestData = ''
    for (let i = 0; i < report.memberFirstName.length; i++) {
      memberData += '\tMEMBER NAME: ' + report.memberFirstName[i] + ' ' + report.memberLastName[i] + '\n\tATTENDED: ' + commonUtil.convertBooleanToReportValue(report.attended[i]) + '\n\n'
    }
    for (let i = 0; i < report.guestFirstName.length; i++) {
      guestData += '\tGUEST NAME: ' + report.guestFirstName[i] + ' ' + report.guestLastName[i] + '\n\tATTENDED: Yes'
    }

    if (!commonUtil.objectHasContents(memberData)) {
      memberData = '\tNo Members Checked-In.\n'
    }
    if (!commonUtil.objectHasContents(guestData)) {
      guestData = '\tNo Guests Checked-In.'
    }
    if (!commonUtil.objectHasContents(report.totalMembersAttended)) {
      report.totalMembersAttended = 0
      report.percentAttended = 0
    }
    if (!commonUtil.objectHasContents(report.totalMembers)) {
      report.totalMembers = await hcDao.getGroupMembersTotal(report.groupId)
    }

    data += stringFormat(smallGroupReport, report.groupName, report.totalMembers, report.totalMembersAttended, report.percentAttended, memberData, guestData)
  }
  return createReportFile(data, meetingDate)
}

function createReportFile (data, meetingDate) {
  const result = {
    success: false,
    error: null,
    reportFilePath: null
  }
  return new Promise((resolve) => {
    const path = './small_group_report_' + commonUtil.replaceAllOccurrencesOfString(meetingDate, '/', '_') + '.txt'
    fs.writeFile(path, data, async function (error) {
      if (error) {
        result.error = error
        resolve(result)
      }
      result.success = true
      result.reportFilePath = path
      resolve(result)
    })
  })
}

function deleteReport (path) {
  const result = {
    deleted: false,
    error: null
  }
  return new Promise((resolve) => {
    fs.unlink(path, async function (error) {
      if (error) {
        result.error = error
        resolve(result)
      }
      result.deleted = true
      resolve(result)
    })
  })
}

module.exports = {
  getAllSundaysInYear,
  getAttendanceReport,
  saveReport,
  deleteReport
}
