const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

const { hasLoggedIn, hasLoggedOut } = require('../../auth/auth')

router.get('/', hasLoggedIn, async (req, res) => {
  const records = await Record.find({ userId: req.user._id, isDelete: false }).sort({ date: 'desc' }).lean()
  let totalAmount = 0
  records.forEach(record => (totalAmount += record.amount))
  const categories = await Category.find().lean()
  res.render('index', { records, categories, totalAmount, indexScripts: true })
})

router.post('/', hasLoggedIn, async (req, res) => {
  const results = await Record.aggregate([
    {
      $match: {
        userId: req.user._id,
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

router.post('/filter', hasLoggedIn, async (req, res) => {
  const { category } = req.body
  const results = await Record.aggregate([
    {
      // similar to find({ category })
      $match: { category, userId: req.user._id }
    },
    {
      // join with collection 'categories'
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: 'name',
        as: 'iconPair'
      }
    }
  ])
  res.send(results)
})

router.get('/welcome', hasLoggedOut, (req, res) => {
  res.render('welcome', { notNavBar: true })
})

module.exports = router
