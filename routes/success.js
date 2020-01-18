const express = require('express')
const router = express.Router()

/* GET success page. */
router.get('/', function (req, res, next) {
  if (!req.session.leader) {
    res.redirect('login')
  } else {
    res.render('success', { leader: req.session.leader })
  }
})

module.exports = router
