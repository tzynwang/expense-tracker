const express = require('express')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const loginVerify = require('./auth/passportLocal')
const loginVerifyFB = require('./auth/passportFB')
const { navButtons } = require('./auth/auth')
const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')

app.use(session({
  secret: process.env.SESSION_SECRET_KEY || 'The quick brown fox jumps over the lazy dog',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.registerSuccess = req.flash('registerSuccess')
  res.locals.loginHint = req.flash('loginHint')
  res.locals.logoutSuccess = req.flash('logoutSuccess')
  res.locals.passportLocalError = req.flash('error')
  next()
})
loginVerify(passport)
loginVerifyFB(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(navButtons)
app.engine('handlebars', expressHandlebars({ helpers: handlebarsHelpers(), defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(routes)

require('./config/mongoose')

app.listen(port, (error) => {
  error ? console.log('error', error) : console.log(`App is running on http://localhpst:${port}/welcome`)
})
