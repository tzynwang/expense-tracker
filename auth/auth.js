function hasLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('loginHint', '請先登入')
  res.redirect('/user/login')
}

function hasLoggedOut (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function navButtons (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated()
  return next()
}

module.exports = { hasLoggedIn, hasLoggedOut, navButtons }
