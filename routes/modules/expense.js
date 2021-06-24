const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

// add (view)
router.get('/add', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('add', { categories })
})

// add (add)
router.post('/add', async (req, res) => {
  const userInput = req.body
  const categories = await Category.find().lean()

  if (Object.keys(userInput).length !== 4) {
    res.render('add', { categories, userInput, errorMessage: '四個選項都須填寫資料' })
    return
  }

  for (const key in userInput) {
    if (!userInput[key]) {
      res.render('add', { categories, userInput, errorMessage: '四個選項都須填寫資料' })
      return
    }
  }

  const { name, category, date, amount } = req.body
  await Record.create({ name, category, date, amount })
  res.redirect('/')
})

// edit page (view)
router.get('/:id', async (req, res) => {
  const id = req.params.id
  const record = await Record.findById(id).lean()
  const categories = await Category.find().lean()
  res.render('edit', { record, categories })
})

// edit page (edit)
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const toUpdate = await Record.findOne({ _id: id })
  for (const key in req.body) {
    if (req.body[key].length) toUpdate[key] = req.body[key]
  }
  await toUpdate.save()
  res.redirect('/')
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  await Record.findOneAndRemove({ _id: id })
  res.redirect('/')
})

module.exports = router
