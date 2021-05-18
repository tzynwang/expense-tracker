const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

router.get('/', (req, res) => {
  // find all expense record
  Record.find()
    .lean()
    .sort({ date: 'asc' })
    .then(records => {
      let totalAmount = 0
      records.forEach(record => {
        // calculate total expense amount
        totalAmount += record.amount
      })
      // get categories
      Category.find()
        .lean()
        .then(categories => {
          res.render('index', { records, categories, totalAmount })
        })
    })
})

module.exports = router
