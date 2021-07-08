const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

const { hasLoggedIn } = require('../../auth/auth')
router.use(hasLoggedIn)

router.post('/filter', hasLoggedIn, async (req, res) => {
  const { condition } = req.body
  const category = condition.category ? condition.category : ''
  const date = condition.date ? condition.date : ''

  const results = await Record.aggregate([
    {
      // similar to find({ category })
      $match: {
        userId: req.user._id,
        isDelete: false,
        category: { $regex: category },
        date: { $regex: date }
      }
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

// add (view)
router.get('/add', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('add', { categories, breadcrumb: 'add' })
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
  res.render('edit', { record, categories, breadcrumb: 'edit' })
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
