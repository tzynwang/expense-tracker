const Categories = require('../categories')
const db = require('../../config/mongoose')

const categoryArray = require('../../sampleCategories.json')

db.once('open', () => {
  console.log('mongodb connect')
  categoryArray.results.forEach(eachCategory => {
    Categories.create({
      name: eachCategory.name,
      icon: eachCategory.icon
    })
  })
  console.log('Generate categories by seeder DONE')
})
