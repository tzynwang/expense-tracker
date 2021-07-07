const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

const { hasLoggedIn, hasLoggedOut } = require('../../auth/auth')

router.get('/', hasLoggedIn, async (req, res) => {
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const records = await Record.find({
    userId: req.user._id,
    date: { $regex: currentMonth },
    isDelete: false
  })
    .sort({ date: 'desc' })
    .lean()
  let totalAmount = 0
  records.forEach(record => (totalAmount += record.amount))
  const categories = await Category.find().lean()
  const username = req.user.username
  res.render('index', { username, records, categories, totalAmount, currentMonth, indexScripts: true })
})

router.post('/', hasLoggedIn, async (req, res) => {
  const results = await Record.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $regex: req.body.month },
        isDelete: false
      }
    },
    {
      $group: {
        _id: '$category',
        amount: {
          $sum: {
            $sum: '$amount'
          }
        }
      }
    }
  ])
  res.send(results)
})

router.get('/welcome', hasLoggedOut, (req, res) => {
  res.render('welcome', { notNavBar: true })
})

module.exports = router
