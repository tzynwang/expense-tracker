const express = require('express')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const loginVerify = require('./auth/passportLocal')
const loginVerifyFB = require('./auth/passportFB')
const { setAuthStatus, navAvatar } = require('./auth/auth')
const { setResLocalsVariables } = require('./tools/resLocals')
const MongoStore = require('connect-mongo')
const expressHandlebars = require('express-handlebars')
const handlebarsHelpers = require('handlebars-helpers')(['array', 'comparison'])
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const methodOverride = require('method-override')
const routes = require('./routes')

app.use(session({
  secret: process.env.SESSION_SECRET_KEY || 'The quick brown fox jumps over the lazy dog',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker' })
}))
app.use(flash())
loginVerify(passport)
loginVerifyFB(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(setAuthStatus)
app.use(navAvatar)
app.use(setResLocalsVariables)
app.engine('handlebars', expressHandlebars({ helpers: handlebarsHelpers, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(routes)
app.use((req, res) => {
  res.status(404).render('404')
})

require('./config/mongoose')

app.listen(port, (error) => {
  error
    ? console.log('error', error)
    : console.log(`App is running on http://localhpst:${port}/welcome`)
})
