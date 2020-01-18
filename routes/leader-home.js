const leaderHomeService = require('../service/leader-home')
const commonUtil = require('../util/common-util')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET leader home page. */
router.get('/', async function (req, res, next) {
  if (!req.session.user) {
    res.redirect('login')
  }
  res.render('leader-home', { leader: req.session.leader, members: req.session.members, date: commonUtil.getFormattedDate() })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    const attendanceData = req.body.attendanceData
    if (commonUtil.objectHasContents(attendanceData) && attendanceData.length > 0) {
      for (const member of attendanceData) {
        const names = leaderHomeService.parseMemberName(member)
        const groupId = req.session.leader._groupId
        const groupName = req.session.leader._groupName
        await hcDao.addAttendanceRecord(groupId, names.firstName, names.lastName, commonUtil.getFormattedDate(), groupName)
      }
      res.redirect('success')
    } else {
      res.redirect('home')
    }
  }
})

module.exports = router
