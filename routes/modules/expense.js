const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

const { hasLoggedIn } = require('../../auth/auth')
router.use(hasLoggedIn)

// add (view)
router.get('/add', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('add', { categories })
})

// add (add)
router.post('/add', async (req, res) => {
  const { name, category, date, amount, merchant } = req.body
  const userInput = req.body
  const categories = await Category.find().lean()

  if (!name.trim().length || !category.trim().length || !date.trim().length || !amount.trim().length) {
    return res.render('add', { categories, userInput, errorMessage: '有*的項目皆為必填' })
  }

  await Record.create({ name, category, date, amount, merchant, userId: req.user._id })
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
  await Record.findOneAndUpdate({ _id: id }, { isDelete: true })
  res.redirect('/')
})

module.exports = router
