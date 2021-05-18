const Records = require('../records')
const Categories = require('../categories')
const db = require('../../config/mongoose')

const sampleRecords = require('../../sampleRecords.json')

db.once('open', () => {
  console.log('mongodb connect')
  sampleRecords.results.forEach(eachRecord => {
    // get category id-name pair
    Categories.find({ name: eachRecord.category }, { _id: 1 })
      .lean()
      .then(result => {
        const categoryId = result[0]._id
        Records.create({
          name: eachRecord.name,
          category: categoryId,
          date: new Date().toISOString(), // the time that runs seeds scripts
          amount: eachRecord.amount
        })
      })
  })
  console.log('Generate records by seeder DONE')
})
