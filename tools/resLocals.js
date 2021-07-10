function setResLocalsVariables (req, res, next) {
  res.locals.registerSuccess = req.flash('registerSuccess')
  res.locals.loginHint = req.flash('loginHint')
  res.locals.logoutSuccess = req.flash('logoutSuccess')
  res.locals.passportLocalError = req.flash('error')
  return next()
}

module.exports = { setResLocalsVariables }
