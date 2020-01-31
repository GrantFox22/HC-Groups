const commonUtil = require('../util/common-util')
const express = require('express')
const hcDao = require('../repository/hc-dao')
const leaderHomeValidator = require('../validation/leader-home-validator')
const leaderHomeService = require('../service/leader-home')
const bcrypt = require('bcrypt')
const router = express.Router()

/* GET login page. */
router.get('/', async function (req, res, next) {
  res.render('login', { usernameError: null, passwordError: null, username: null })
})

router.post('/', async function (req, res, next) {
  const username = req.body.username
  const token = req.body.password

  req.session.user = commonUtil.objectHasContents(username) ? username : null

  if (!commonUtil.objectHasContents(token) || !commonUtil.objectHasContents(username)) {
    const passwordError = commonUtil.objectHasContents(token) ? null : 'Password is a required field'
    const usernameError = commonUtil.objectHasContents(username) ? null : 'Username is a required field'
    res.render('login', { usernameError: usernameError, passwordError: passwordError, username: username })
  } else {
    hcDao.getLeader(username.toLowerCase())
      .then(function (leader) {
        if (!leaderHomeValidator.isValidLeader(leader)) {
          res.render('login', { usernameError: 'Invalid Username', passwordError: null, username: username })
        } else {
          req.session.leader = leader
          return bcrypt.compare(token, leader.leaderToken)
            .then(async function (samePassword) {
              if (!samePassword) {
                res.render('login', { usernameError: null, passwordError: 'Invalid Password', username: username })
              } else {
                const leaderHomeData = await leaderHomeService.loadLeaderHomePage(req.session.leader)
                req.session.members = leaderHomeData.members
                res.redirect('leader-home')
              }
            })
            .catch(function (error) {
              console.log('Error authenticating user: ' + error)
              next()
            })
        }
      })
      .catch(function (error) {
        console.log('Error authenticating user: ' + error)
        next()
      })
  }
})

module.exports = router
