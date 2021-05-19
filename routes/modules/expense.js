const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

router
  // add (view)
  .get('/add', (req, res) => {
    Category.find({}, { name: 1, _id: 0 })
      .lean()
      .sort({ _id: 'asc' })
      .then(categoryResult => {
        res.render('add', { categoryResult })
      })
  })
  // add (add)
  .post('/add', (req, res) => {
    const userInput = req.body
    if (Object.keys(userInput).length !== 4) {
      Category.find({}, { name: 1, _id: 0 })
        .lean()
        .sort({ _id: 'asc' })
        .then(categoryResult => {
          res.render('add', { categoryResult, userInput, errorMessage: '四個選項都須填寫資料' })
        })
    }
    for (const key in userInput) {
      if (userInput[key].length === 0 || userInput[key] === undefined) {
        Category.find({}, { name: 1, _id: 0 })
          .lean()
          .sort({ _id: 'asc' })
          .then(categoryResult => {
            res.render('add', { categoryResult, userInput, errorMessage: '四個選項都須填寫資料' })
          })
      }
    }
    Record.create({
      name: req.body.name,
      category: req.body.category,
      date: req.body.date,
      amount: req.body.amount
    })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })
  // edit page (view)
  .get('/:id', (req, res) => {
    const id = req.params.id
    Record.findById(id)
      .lean()
      .then(recordResult => {
        Category.find({}, { name: 1, _id: 0 })
          .lean()
          .sort({ _id: 'asc' })
          .then(categoryResult => {
            res.render('edit', { recordResult, categoryResult })
          })
      })
      .catch(error => console.log(error))
  })
  // edit page (edit)
  .put('/:id', (req, res) => {
    const id = req.params.id
    return Record.findById(id)
      .then(recordToUpdate => {
        for (const key in req.body) {
          if (req.body[key].length > 0 && req.body[key] !== undefined) {
            recordToUpdate[key] = req.body[key]
          }
        }
        return recordToUpdate.save()
      })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })
  .delete('/:id', (req, res) => {
    const id = req.params.id
    return Record.findById(id)
      .then(recordToDelete => recordToDelete.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

module.exports = router
