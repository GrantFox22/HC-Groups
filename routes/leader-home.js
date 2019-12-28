require('dotenv').config()
const debug = require('../config/debug')('app:leader-home')
const express = require('express')
const router = express.Router()

/* GET leader home page. */
router.get('/', async function (req, res, next) {
  res.render('leader-home', { user: 'grant.fox' })
})

router.post('/', async function (req, res, next) {

})

module.exports = router
