const Categories = require('../categories')
const db = require('../../config/mongoose')

const categoryArray = require('../../sampleCategories.json')

db.once('open', () => {
  console.log('mongodb connect')
  Categories.create(categoryArray)
    .then(() => {
      console.log('Generate categories by seeder DONE')
      return db.close()
    })
})
