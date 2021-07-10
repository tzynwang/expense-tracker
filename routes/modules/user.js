const express = require('express')
const router = express.Router()

// DB
const User = require('../../models/users')
const Record = require('../../models/records')

// password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

// passport
const passport = require('passport')

// only direct not logged in user to login or register endpoint
const { hasLoggedIn, hasLoggedOut } = require('../../auth/auth')

// generate avatar
const { generateAvatar } = require('../../tools/generateAvatar')

// download record data
const { download } = require('../../tools/recordsDownload')

// for reset password
const jwt = require('jsonwebtoken')
const secretKey = process.env.SESSION_SECRET_KEY || 'The quick brown fox jumps over the lazy dog'
const { resetPasswordMail } = require('../../auth/resetPasswordMail')

router.get('/', hasLoggedIn, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).lean()
  const avatar = user.avatar ? `data:image${user.avatar.contentType};base64,${user.avatar.data.toString('base64')}` : null
  const formErrors = req.session.formErrors ? req.session.formErrors : null
  const updateSuccess = req.session.updateSuccess ? req.session.updateSuccess : null
  req.session.formErrors = req.session.updateSuccess = null // clear session
  res.render('user', { user, avatar, formErrors, updateSuccess })
})

router.put('/', hasLoggedIn, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
  const formErrors = []

  if (req.files) {
    if (req.files.avatar.mimetype === 'image/jpeg' || req.files.avatar.mimetype === 'image/png') {
      user.avatar.data = req.files.avatar.data
      user.avatar.contentType = req.files.avatar.mimetype
    } else {
      formErrors.push({ message: '頭像圖片僅支援jp(e)g或png格式之檔案' })
    }
  }
  if (req.body.username) {
    req.body.username.trim().length
      ? user.username = req.body.username
      : formErrors.push({ message: '請至少輸入一個字' })
  }
  if (req.body.password) {
    const passwordLength = req.body.password.trim().length
    if (passwordLength < 6 || passwordLength > 18) {
      formErrors.push({ message: '密碼長度限制6到18個字元' })
    }
    if (req.body.password !== req.body.passwordConfirm) {
      formErrors.push({ message: '密碼與確認密碼內容不同' })
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, saltRounds)
      user.password = hashPassword
    }
  }

  if (formErrors.length) {
    req.session.updateSuccess = null
    req.session.formErrors = formErrors
    return res.redirect('/user')
  } else {
    req.session.updateSuccess = [{ message: '資料更新成功' }]
  }

  await user.save()
  res.redirect('/user')
})

router.delete('/', async (req, res) => {
  const { deleteConfirmation } = req.body
  if (deleteConfirmation !== `deleteConfirmation/${req.user.email}`) {
    req.session.formErrors = [{ message: '帳戶刪除確認碼不正確，無法刪除帳戶' }]
    return res.redirect('/user')
  }

  await Record.deleteMany({ userId: req.user._id })
  await User.findOneAndDelete({ _id: req.user._id })

  req.logout()
  req.flash('logoutSuccess', '有緣再相會 👋😭')
  res.redirect('/welcome')
})

router.get('/login', hasLoggedOut, (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

router.get('/register', hasLoggedOut, (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body
  const formErrors = []

  if (!email || !password || !passwordConfirm) formErrors.push({ message: '標記*號為必填項目' })
  if (username && username.length > 16) formErrors.push({ message: '顯示名稱限制最多16字' })
  const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!email.match(emailReg)) formErrors.push({ message: '請檢查Email格式' })
  if (password.length < 6 || password.length > 18) formErrors.push({ message: '密碼長度限制6到18個字元' })
  if (password !== passwordConfirm) formErrors.push({ message: '密碼與確認密碼內容不同' })
  const find = await User.findOne({ email })
  if (find) formErrors.push({ message: '此Email已經註冊過了' })
  if (formErrors.length) return res.render('register', { formErrors })

  const hashPassword = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    type: 'local',
    avatar_url: generateAvatar(email.split('@')[0])
  })
  await newUser.save()
  req.flash('registerSuccess', '註冊成功，您現在可以登入了 😊')
  res.redirect('/user/login')
})

router.get('/resetPassword', hasLoggedOut, (req, res) => {
  res.render('resetPassword')
})

router.post('/resetPassword', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    req.flash('error', '此Email並未註冊過，無法重設密碼')
    res.redirect('/user/register')
  } else if (user.type !== 'local') {
    req.flash('error', '僅有非透過第三方帳號登入的使用者可以重設密碼')
    res.redirect('/user/login')
  } else {
    const token = jwt.sign({ email, password: user.password }, secretKey, { expiresIn: '30m' })
    resetPasswordMail(email, token)
    req.flash('registerSuccess', '重設密碼的Email已發送')
    res.redirect('/user/login')
  }
})

router.get('/resetPassword/:token', hasLoggedOut, (req, res) => {
  const token = req.params.token
  jwt.verify(token, secretKey, { maxAge: '30m' }, async (error, decoded) => {
    if (error) {
      req.flash('error', '金鑰無效')
      res.redirect('/user/resetPassword')
    }

    const { email, password } = decoded
    const user = await User.findOne({ email })

    if (!user) {
      req.flash('error', '此Email並未註冊過')
      res.redirect('/user/register')
    } else if (user.password !== password) {
      req.flash('error', '此金鑰已重設過密碼')
      res.redirect('/user/login')
    } else {
      res.render('resetPasswordForm', { token })
    }
  })
})

router.post('/resetPassword/:token', (req, res) => {
  const token = req.params.token
  jwt.verify(token, secretKey, async (error, decoded) => {
    if (error) {
      req.flash('error', '金鑰無效')
      res.redirect('/user/resetPassword')
    }

    const { email } = decoded
    const user = await User.findOne({ email })
    if (!user) {
      req.flash('error', '此Email並未註冊過')
      res.redirect('/user/register')
    }

    const { password, passwordConfirm } = req.body
    if (password !== passwordConfirm) {
      res.render('resetPasswordForm', { token, errorMessage: '密碼與確認密碼內容不同' })
    } else {
      const hashPassword = await bcrypt.hash(password, saltRounds)
      user.password = hashPassword
      await user.save()
      req.flash('registerSuccess', '密碼重設成功 😊')
      res.redirect('/user/login')
    }
  })
})

router.get('/download', hasLoggedIn, (req, res) => {
  download(req, res)
})

router.get('/logout', hasLoggedIn, (req, res) => {
  req.logout()
  req.flash('logoutSuccess', '您已登出 👋')
  res.redirect('/welcome')
})

module.exports = router
