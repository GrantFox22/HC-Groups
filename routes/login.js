require('dotenv').config()
const debug = require('../config/debug')('app:login')
const commonUtil = require('../util/common-util')
const express = require('express')
const hcDao = require('../repository/hc-dao')
const bcrypt = require('bcrypt')
const router = express.Router()

/* GET login page. */
router.get('/', async function (req, res, next) {
  res.render('login')
})

router.post('/', async function (req, res, next) {
  const username = req.body.username
  const token = req.body.password

  req.session.user = commonUtil.objectHasContents(username) ? username : null

  hcDao.getLeader(username)
    .then(function (user) {
      return bcrypt.compare(token, user.leaderToken)
    })
    .then(function (samePassword) {
      if (!samePassword) {
        res.status(403).send()
      }
      res.redirect('leader-home')
    })
    .catch(function (error) {
      debug('Error authenticating user: %O', error)
      next()
    })
})

module.exports = router
