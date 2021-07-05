const Categories = require('../categories')
const db = require('../../config/mongoose')

const categoryArray = require('./sampleCategories.json')

db.once('open', async () => {
  console.log('mongodb connect from categorySeeder')
  await Categories.create(categoryArray)
  console.log('mongodb categorySeeder done')
  db.close()
})
