const commonUtil = require('../util/common-util')
const createError = require('http-errors')
const attendanceReportService = require('../service/attendance-report')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET attendance report page. */
router.get('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
  if (!req.session.groups) {
    req.session.groups = await hcDao.getSmallGroups()
  }
  if (!req.session.sundays) {
    req.session.sundays = attendanceReportService.getAllSundaysInYear(2020)
  }
  res.render('attendance-report', { leader: req.session.leader, sundays: req.session.sundays, groups: req.session.groups })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
})

module.exports = router
