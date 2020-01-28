const commonUtil = require('../util/common-util')
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
    if (commonUtil.objectHasContents(req.body) && commonUtil.objectHasContents(req.body.selectedGroup)) {
      const hcMembers = await hcDao.getSmallGroupMembersForAdmin(req.body.selectedGroup)
      res.render('manage-members', { leader: req.session.leader, date: commonUtil.getFormattedDate(), groups: req.session.groups, hcMembers: hcMembers, selectedGroup: req.body.selectedGroup })
    } else {
      res.render('manage-members', { leader: req.session.leader, date: commonUtil.getFormattedDate(), groups: req.session.groups, hcMembers: null, selectedGroup: null })
    }
  }
})

module.exports = router
