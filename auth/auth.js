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

function setAuthStatus (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated()
  return next()
}

function navAvatar (req, res, next) {
  if (req.user) {
    res.locals.navAvatar = req.user.avatar.data ? `data:image${req.user.avatar.contentType};base64,${req.user.avatar.data.toString('base64')}` : req.user.avatar_url
  }
  return next()
}

module.exports = { hasLoggedIn, hasLoggedOut, setAuthStatus, navAvatar }
