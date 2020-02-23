const commonUtil = require('../util/common-util')
const createError = require('http-errors')
const manageGroupsService = require('../service/manage-groups')
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
  res.render('manage-groups', { leader: req.session.leader, groups: req.session.groups })
})

router.post('/', async function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    if (manageGroupsService.saveChangesClicked(req.body)) {
      const modifiedGroups = commonUtil.convertToArray(req.body.modifiedData)
      const deletedGroups = commonUtil.convertToArray(req.body.deletedData)
      const newGroups = commonUtil.convertToArray(req.body.newGroupName)
      const groupNames = commonUtil.convertToArray(req.body.groupName)

      const result = await manageGroupsService.saveGroupChanges(modifiedGroups, deletedGroups, newGroups, groupNames)
      if (result.success) {
        req.session.groups = await hcDao.getSmallGroups()
        res.redirect('admin-success')
      } else {
        next(createError(500))
      }
    } else {
      res.render('manage-groups', { leader: req.session.leader, groups: req.session.groups, hcMembers: null, selectedGroup: null })
    }
  }
})

module.exports = router
