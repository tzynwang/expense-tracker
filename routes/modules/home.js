const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

router
  .get('/', (req, res) => {
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
  .post('/filter', (req, res) => {
    const selectedCategory = req.body.category
    Record
      .aggregate([
        {
          // similar to find({}, {category: selectedCategory})
          $match: { category: selectedCategory }
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
      .then(results => res.send(results))
  })

module.exports = router
