const express = require('express')
const router = express.Router()

// passport
const passport = require('passport')

// request email and public_profile from FB
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// response from FB
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

module.exports = router
