const Categories = require('../categories')
const db = require('../../config/mongoose')

const categoryArray = require('./sampleCategories.json')

db.once('open', async () => {
  console.log('mongodb connect categories')
  await Categories.create(categoryArray)
  console.log('Generate categories by seeder DONE')
  db.close()
})
