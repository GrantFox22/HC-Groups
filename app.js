const bodyParser = require('body-parser')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const genuuid = require('uuid4')

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const registerRouter = require('./routes/register')
const leaderHomeRouter = require('./routes/leader-home')
const successRouter = require('./routes/success')
const manageMembersRouter = require('./routes/manage-members')
const manageGroupsRouter = require('./routes/manage-groups')
const manageLeadersRouter = require('./routes/manage-leaders')
const adminSuccessRouter = require('./routes/admin-success')
const attendanceReportRouter = require('./routes/attendance-report')

const app = express()

app.use(session({
  secret: genuuid(),
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { secure: false, expires: 30 * 60 * 1000 }
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/register', registerRouter)
app.use('/leader-home', leaderHomeRouter)
app.use('/success', successRouter)
app.use('/manage-members', manageMembersRouter)
app.use('/manage-groups', manageGroupsRouter)
app.use('/manage-leaders', manageLeadersRouter)
app.use('/admin-success', adminSuccessRouter)
app.use('/attendance-report', attendanceReportRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
