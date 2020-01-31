const commonUtil = require('../util/common-util')
const createError = require('http-errors')
const manageMembersService = require('../service/manage-members')
const leaderHomeService = require('../service/leader-home')
const hcDao = require('../repository/hc-dao')
const express = require('express')
const router = express.Router()

/* GET manage members page. */
router.get('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  }
  if (!req.session.groups) {
    req.session.groups = await hcDao.getSmallGroups()
  }
  res.render('manage-members', { leader: req.session.leader, date: commonUtil.getFormattedDate(), groups: req.session.groups, hcMembers: null, selectedGroup: null })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    if (manageMembersService.selectOptionChangedOnly(req.body)) {
      req.session.hcMembers = await hcDao.getSmallGroupMembersForAdmin(req.body.selectedGroup)
      res.render('manage-members', { leader: req.session.leader, date: commonUtil.getFormattedDate(), groups: req.session.groups, hcMembers: req.session.hcMembers, selectedGroup: req.body.selectedGroup })
    } else if (manageMembersService.saveChangesClicked(req.body)) {
      const modifiedMembers = commonUtil.convertToArray(req.body.modifiedData)
      const deletedMembers = commonUtil.convertToArray(req.body.deletedData)
      const newMemberFirstNames = commonUtil.convertToArray(req.body.newMemberFirstName)
      const newMemberLastNames = commonUtil.convertToArray(req.body.newMemberLastName)
      const memberFirstNames = commonUtil.convertToArray(req.body.memberFirstName)
      const memberLastNames = commonUtil.convertToArray(req.body.memberLastName)

      const result = await manageMembersService.saveMemberChanges(modifiedMembers, deletedMembers, newMemberFirstNames, newMemberLastNames, memberFirstNames, memberLastNames, req.body.selectedGroup)
      if (result.success) {
        const leaderHomeData = await leaderHomeService.loadLeaderHomePage(req.session.leader)
        req.session.members = leaderHomeData.members
        res.redirect('admin-success')
      } else {
        next(createError(500))
      }
    } else {
      res.render('manage-members', { leader: req.session.leader, date: commonUtil.getFormattedDate(), groups: req.session.groups, hcMembers: null, selectedGroup: null })
    }
  }
})

module.exports = router
