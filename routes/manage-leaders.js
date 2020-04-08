const commonUtil = require('../util/common-util')
const createError = require('http-errors')
const manageLeadersService = require('../service/manage-leaders')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET manage leaders page. */
router.get('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
  if (!req.session.groups) {
    req.session.groups = await hcDao.getSmallGroups()
  }
  if (!req.session.leaders) {
    req.session.leaders = await hcDao.getLeaders()
  }
  res.render('manage-leaders', { leader: req.session.leader, groups: req.session.groups, leaders: req.session.leaders })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    if (manageLeadersService.saveChangesClicked(req.body)) {
      const leaderData = {
        modifiedLeaders: commonUtil.convertToArray(req.body.modifiedData),
        deletedLeaders: commonUtil.convertToArray(req.body.deletedData),
        newLeaderFirstName: commonUtil.convertToArray(req.body.newLeaderFirstName),
        newLeaderLastName: commonUtil.convertToArray(req.body.newLeaderLastName),
        newLeaderUserId: commonUtil.convertToArray(req.body.newLeaderUserId),
        newLeaderType: commonUtil.convertToArray(req.body.newLeaderType),
        newGroup: commonUtil.convertToArray(req.body.newGroup),
        leaderFirstName: commonUtil.convertToArray(req.body.leaderFirstName),
        leaderLastName: commonUtil.convertToArray(req.body.leaderLastName),
        leaderUserId: commonUtil.convertToArray(req.body.leaderUserId),
        leaderType: commonUtil.convertToArray(req.body.leaderType),
        assignedGroup: commonUtil.convertToArray(req.body.assignedGroup)
      }
      const result = await manageLeadersService.saveLeaderChanges(leaderData)
      if (result.success) {
        req.session.leaders = await hcDao.getLeaders()
        res.redirect('admin-success')
      } else {
        next(createError(500))
      }
    } else {
      res.render('manage-leaders', { leader: req.session.leader, groups: req.session.groups, leaders: req.session.leaders })
    }
  }
})

module.exports = router
