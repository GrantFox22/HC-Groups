const express = require('express')
const router = express.Router()

/* GET success page. */
router.get('/', function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    res.render('success')
  }
})

module.exports = router
