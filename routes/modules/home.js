const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

router.get('/', async (req, res) => {
  const records = await Record.find().sort({ date: 'desc' }).lean()
  let totalAmount = 0
  records.forEach(record => (totalAmount += record.amount))
  const categories = await Category.find().lean()
  res.render('index', { records, categories, totalAmount })
})

router.post('/filter', async (req, res) => {
  const { category } = req.body
  const results = await Record.aggregate([
    {
      // similar to find({}, { category })
      $match: { category }
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

module.exports = router
