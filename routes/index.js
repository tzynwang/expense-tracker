const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const auth = require('./modules/auth')
const user = require('./modules/user')
const expense = require('./modules/expense')

router.use('/', home)
router.use('/auth', auth)
router.use('/user', user)
router.use('/expense', expense)

module.exports = router
