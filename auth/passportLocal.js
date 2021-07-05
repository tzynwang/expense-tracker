const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/users')

function loginVerify (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      const user = await User.findOne({ email })
      if (!user) return done(null, false, { message: '此Email並未註冊過' })

      const compareResult = await bcrypt.compare(password, user.password)
      return compareResult ? done(null, user) : done(null, false, { message: '密碼錯誤' })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user)
    })
  })
}

module.exports = loginVerify
