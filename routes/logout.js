const express = require('express')
const router = express.Router()

/* GET logout page. */
router.get('/', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        next(error)
      } else {
        res.render('logout')
      }
    })
  }
})

module.exports = router
