const commonUtil = require('../util/common-util')
const attendanceReportService = require('../service/attendance-report')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET attendance report page. */
router.get('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
  if (!req.session.sundays) {
    req.session.sundays = attendanceReportService.getAllSundaysInYear(2020)
  }
  res.render('attendance-report', { leader: req.session.leader, sundays: req.session.sundays, groups: null, noSundaySelectedError: null, error: null, reportSaved: null })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
  if (!req.session.groups) {
    req.session.groups = await hcDao.getSmallGroups()
  }
  if (commonUtil.objectHasContents(req.body) && commonUtil.objectHasContents(req.body.sunday) && req.body.sunday !== 'default') {
    const allGroupAttendanceReports = []
    for (const group of req.session.groups) {
      const attendanceReport = await attendanceReportService.getAttendanceReport(group._groupId, req.body.sunday, group._groupName)
      if (attendanceReport.success) {
        allGroupAttendanceReports.push(attendanceReport.attendanceReport)
      } else {
        res.render('attendance-report', { leader: req.session.leader, sundays: req.session.sundays, groups: req.session.groups, noSundaySelectedError: null, error: attendanceReport.error, reportSaved: null })
      }
    }
    const saveReportResult = await attendanceReportService.saveReport(allGroupAttendanceReports, req.body.sunday)
    if (saveReportResult.success && commonUtil.objectHasContents(saveReportResult.reportFilePath)) {
      res.download(saveReportResult.reportFilePath)
    } else {
      res.render('attendance-report', { leader: req.session.leader, sundays: req.session.sundays, groups: req.session.groups, noSundaySelectedError: null, error: saveReportResult.error, reportSaved: null })
    }
  } else {
    res.render('attendance-report', { leader: req.session.leader, sundays: req.session.sundays, groups: req.session.groups, noSundaySelectedError: 'Error: Must Select a Small Group Meeting Date for Report.', error: null, reportSaved: null })
  }
})

module.exports = router
